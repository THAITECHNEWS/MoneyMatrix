import * as fs from 'fs';
import * as path from 'path';

interface QuestionData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: string;
}

interface Cluster {
  name: string;
  description: string;
  questions: QuestionData[];
  priority: number;
  estimatedArticles: number;
}

function parseCSV(filePath: string): QuestionData[] {
  // File is UTF-16 LE encoded, convert to UTF-8
  const buffer = fs.readFileSync(filePath);
  let content: string;
  
  // Check for UTF-16 LE BOM (FF FE)
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    // Convert UTF-16 LE to UTF-8
    content = buffer.toString('utf16le', 2); // Skip BOM
  } else {
    content = buffer.toString('utf-8');
  }
  
  const lines = content.split(/\r?\n/);
  const questions: QuestionData[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse TSV (tab-separated) - handle quoted fields
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === '\t' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim()); // Add last part
    
    if (parts.length < 15) continue;
    
    let keyword = parts[1]?.replace(/^"|"$/g, '').trim() || '';
    const volume = parseInt(parts[4]?.replace(/^"|"$/g, '') || '0') || 0;
    const difficulty = parseInt(parts[3]?.replace(/^"|"$/g, '') || '0') || 0;
    const cpc = parseFloat(parts[5]?.replace(/^"|"$/g, '') || '0') || 0;
    const intent = parts[14]?.replace(/^"|"$/g, '').trim() || '';
    
    // Clean up keyword - remove any weird spacing
    keyword = keyword.replace(/[\u2000-\u200B\u2028-\u2029\u00A0]/g, ' '); // Remove various space characters
    keyword = keyword.replace(/\s+/g, ' ').trim(); // Normalize spaces
    
    if (keyword && keyword !== 'Keyword' && keyword !== 'keyword' && keyword.length > 0) {
      const cleanKeyword = keyword.toLowerCase().trim();
      questions.push({
        keyword: cleanKeyword,
        volume,
        difficulty,
        cpc,
        intent
      });
    }
  }
  
  return questions;
}

function clusterQuestions(questions: QuestionData[]): Cluster[] {
  const clusters: Map<string, QuestionData[]> = new Map();
  
  // Define cluster patterns (ordered by specificity - most specific first)
  const clusterPatterns: Array<{name: string; keywords: string[]}> = [
    {
      name: 'Specific Lenders',
      keywords: ['ace cash', 'pls', 'check into cash', 'advance america', 'viva', 'navy federal', 'chase', 'woodforest', 'pnc', 'capital one']
    },
    {
      name: 'State-Specific',
      keywords: ['in texas', 'in california', 'in florida', 'in ohio', 'in new york', 'in virginia', 'in pa', 'in ct', 'in massachusetts', 'in michigan', 'in missouri', 'in kentucky', 'in connecticut', 'in delaware', 'in iowa', 'in nebraska', 'in kansas', 'in arkansas', 'in illinois', 'in oregon', 'in alabama', 'states where', 'which states']
    },
    {
      name: 'Banking & Payment',
      keywords: ['chime', 'direct deposit', 'bank account', 'ach', 'debit', 'block', 'stop debiting', 'close account', 'revoke ach']
    },
    {
      name: 'Multiple Loans',
      keywords: ['how many', 'can you have', 'multiple', 'at once', 'at the same time', 'different places', 'two payday loans', 'get 2 payday']
    },
    {
      name: 'Paying Off & Getting Out',
      keywords: ['how to pay off', 'how to get out', 'consolidate', 'consolidation', 'settle', 'get rid', 'pay off quickly', 'pay off fast', 'help paying off']
    },
    {
      name: 'Legal & Consequences',
      keywords: ['can they sue', 'can sue', 'garnish', 'court', 'jail', 'criminal', 'prosecute', 'enforceable', 'file bankruptcy', 'take you to court']
    },
    {
      name: 'Default & Non-Payment',
      keywords: ['don\'t pay', 'stop paying', 'what happens if', 'consequences', 'collection', 'if you stop', 'if i stop', 'if i don\'t pay']
    },
    {
      name: 'Credit Impact',
      keywords: ['affect credit', 'hurt credit', 'build credit', 'check credit', 'credit score', 'credit report', 'impact credit']
    },
    {
      name: 'Rates & Costs',
      keywords: ['interest rate', 'how much interest', 'how much do', 'cost', 'fee', 'charge', 'apr', 'expensive']
    },
    {
      name: 'Loan Types & Features',
      keywords: ['secured', 'unsecured', 'fixed', 'variable', 'installment', 'revolving', 'online', 'same-day', 'guaranteed']
    },
    {
      name: 'Getting Payday Loans',
      keywords: ['how to get', 'where to get', 'who does', 'who offers', 'apply', 'qualify', 'accept', 'lenders', 'direct lender', 'best payday loans', 'best online']
    },
    {
      name: 'Risks & Warnings',
      keywords: ['are bad', 'why bad', 'dangerous', 'risks', 'scam', 'legit', 'worth it', 'should avoid', 'controversial', 'disadvantages', 'why are payday loans']
    },
    {
      name: 'Alternatives & Comparisons',
      keywords: ['alternatives', 'instead of', 'better than', 'compare', 'vs', 'versus', 'compare to']
    },
    {
      name: 'Usage & Best Practices',
      keywords: ['when to use', 'should use', 'common uses', 'best practices', 'how to use', 'purpose', 'should payday loans be used']
    },
    {
      name: 'Basic Understanding',
      keywords: ['what are', 'what is', 'how do', 'how does', 'how payday loans work', 'definition']
    }
  ];
  
  // Cluster questions
  for (const question of questions) {
    let clustered = false;
    const keywordLower = question.keyword.toLowerCase();
    
    // Check each pattern (most specific first)
    for (const pattern of clusterPatterns) {
      // Check if any keyword in the pattern matches
      const matches = pattern.keywords.some(patternKeyword => {
        const patternLower = patternKeyword.toLowerCase();
        return keywordLower.includes(patternLower);
      });
      
      if (matches) {
        if (!clusters.has(pattern.name)) {
          clusters.set(pattern.name, []);
        }
        clusters.get(pattern.name)!.push(question);
        clustered = true;
        break; // Only assign to first matching cluster
      }
    }
    
    // If not clustered, add to "Other" category
    if (!clustered) {
      if (!clusters.has('Other Questions')) {
        clusters.set('Other Questions', []);
      }
      clusters.get('Other Questions')!.push(question);
    }
  }
  
  console.log(`\nClustering results:`);
  for (const [name, qs] of Array.from(clusters.entries())) {
    console.log(`  ${name}: ${qs.length} questions`);
  }
  
  // Convert to Cluster objects with priority
  const clusterArray: Cluster[] = [];
  
  for (const [name, questions] of Array.from(clusters.entries())) {
    // Calculate priority based on total volume and average difficulty
    const totalVolume = questions.reduce((sum: number, q: QuestionData) => sum + q.volume, 0);
    const avgDifficulty = questions.reduce((sum: number, q: QuestionData) => sum + q.difficulty, 0) / questions.length || 0;
    const avgCPC = questions.reduce((sum: number, q: QuestionData) => sum + q.cpc, 0) / questions.length || 0;
    
    // Priority: Higher volume + Lower difficulty + Higher CPC = Higher priority
    const priority = (totalVolume * 0.4) + ((100 - avgDifficulty) * 0.3) + (avgCPC * 10 * 0.3);
    
    // Estimate articles needed (group similar questions)
    const uniqueQuestions = new Set(questions.map((q: QuestionData) => q.keyword));
    const estimatedArticles = Math.ceil(uniqueQuestions.size / 3); // ~3 questions per article
    
      clusterArray.push({
      name,
      description: `Questions about ${name.toLowerCase()}`,
      questions: questions.sort((a: QuestionData, b: QuestionData) => b.volume - a.volume), // Sort by volume
      priority,
      estimatedArticles: Math.max(1, estimatedArticles)
    });
  }
  
  // Sort by priority
  return clusterArray.sort((a, b) => b.priority - a.priority);
}

function generateContentPlan(clusters: Cluster[]): string {
  let plan = '# Payday Loans Content Plan\n\n';
  plan += `Generated: ${new Date().toISOString()}\n`;
  plan += `Total Questions: ${clusters.reduce((sum: number, c: Cluster) => sum + c.questions.length, 0)}\n`;
  plan += `Total Clusters: ${clusters.length}\n`;
  plan += `Estimated Articles: ${clusters.reduce((sum: number, c: Cluster) => sum + c.estimatedArticles, 0)}\n\n`;
  
  plan += '---\n\n';
  
  for (const cluster of clusters) {
    plan += `## ${cluster.name}\n\n`;
    plan += `**Priority Score:** ${cluster.priority.toFixed(1)}\n`;
    plan += `**Questions:** ${cluster.questions.length}\n`;
    plan += `**Estimated Articles:** ${cluster.estimatedArticles}\n`;
    plan += `**Total Search Volume:** ${cluster.questions.reduce((sum: number, q: QuestionData) => sum + q.volume, 0)}\n\n`;
    
    plan += '### Top Questions (by volume):\n\n';
    const topQuestions = cluster.questions.slice(0, 10);
    for (let i = 0; i < topQuestions.length; i++) {
      const q = topQuestions[i];
      plan += `${i + 1}. "${q.keyword}" (Vol: ${q.volume}, Difficulty: ${q.difficulty}, CPC: $${q.cpc})\n`;
    }
    
    if (cluster.questions.length > 10) {
      plan += `\n... and ${cluster.questions.length - 10} more questions\n`;
    }
    
    plan += '\n### Suggested Article Topics:\n\n';
    
    // Group similar questions for articles
    const articleGroups: QuestionData[][] = [];
    const used = new Set<number>();
    
    for (let i = 0; i < cluster.questions.length; i++) {
      if (used.has(i)) continue;
      
      const group = [cluster.questions[i]];
      used.add(i);
      
      // Find similar questions
      for (let j = i + 1; j < cluster.questions.length && group.length < 3; j++) {
        if (used.has(j)) continue;
        
        const q1 = cluster.questions[i].keyword;
        const q2 = cluster.questions[j].keyword;
        
        // Simple similarity check (shared words)
        const words1 = new Set(q1.split(' '));
        const words2 = new Set(q2.split(' '));
        const intersection = Array.from(words1).filter((w: string) => words2.has(w));
        
        if (intersection.length >= 2) {
          group.push(cluster.questions[j]);
          used.add(j);
        }
      }
      
      articleGroups.push(group);
    }
    
    for (let i = 0; i < Math.min(articleGroups.length, cluster.estimatedArticles); i++) {
      const group = articleGroups[i];
      const mainQuestion = group[0];
      plan += `#### Article ${i + 1}: "${mainQuestion.keyword}"\n`;
      plan += `- **Primary Question:** ${mainQuestion.keyword}\n`;
      plan += `- **Related Questions:** ${group.slice(1).map((q: QuestionData) => q.keyword).join(', ')}\n`;
      plan += `- **Target Volume:** ${group.reduce((sum: number, q: QuestionData) => sum + q.volume, 0)}\n`;
      plan += `- **Suggested Slug:** ${generateSlug(mainQuestion.keyword)}\n\n`;
    }
    
    plan += '---\n\n';
  }
  
  return plan;
}

function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function main() {
  const csvPath = path.join(process.cwd(), 'google_us_payday-loans_matching-terms_2026-01-04_20-37-45.csv');
  
  console.log('📊 Analyzing payday loan questions...\n');
  
  const questions = parseCSV(csvPath);
  console.log(`✅ Parsed ${questions.length} questions\n`);
  
  const clusters = clusterQuestions(questions);
  console.log(`✅ Created ${clusters.length} clusters\n`);
  
  const contentPlan = generateContentPlan(clusters);
  
  const outputPath = path.join(process.cwd(), 'PAYDAY_LOANS_CONTENT_PLAN.md');
  fs.writeFileSync(outputPath, contentPlan);
  
  console.log(`✅ Content plan saved to: ${outputPath}\n`);
  
  // Summary
  console.log('📈 Summary:\n');
  console.log(`Total Questions: ${questions.length}`);
  console.log(`Total Clusters: ${clusters.length}`);
    console.log(`Estimated Articles: ${clusters.reduce((sum: number, c: Cluster) => sum + c.estimatedArticles, 0)}\n`);
  
  console.log('Top 10 Clusters by Priority:\n');
  clusters.slice(0, 10).forEach((cluster, i) => {
    console.log(`${i + 1}. ${cluster.name} (Priority: ${cluster.priority.toFixed(1)}, Questions: ${cluster.questions.length}, Articles: ${cluster.estimatedArticles})`);
  });
  
  // Generate JSON for AI processing
  const jsonOutput = {
    totalQuestions: questions.length,
    clusters: clusters.map(c => ({
      name: c.name,
      priority: c.priority,
      questions: c.questions.map(q => ({
        keyword: q.keyword,
        volume: q.volume,
        difficulty: q.difficulty,
        cpc: q.cpc
      })),
      estimatedArticles: c.estimatedArticles
    }))
  };
  
  const jsonPath = path.join(process.cwd(), 'data/payday-loans-content-plan.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2));
  console.log(`\n✅ JSON data saved to: ${jsonPath}`);
}

if (require.main === module) {
  main();
}

