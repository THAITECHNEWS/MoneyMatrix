#!/usr/bin/env python3
"""
Analyze NerdWallet keyword data to find low KD, high volume opportunities
"""
import csv
import json
from collections import defaultdict

def analyze_keywords():
    low_kd_high_vol = []
    kd_ranges = {
        '0-1': [],
        '2-3': [],
        '4-5': [],
        '6-7': [],
        '8-10': []
    }
    
    categories = defaultdict(list)
    
    # Try reading with different encodings
    encodings = ['utf-16', 'utf-8-sig', 'latin-1']
    
    for encoding in encodings:
        try:
            with open('nerdwallet.com-organic-keywords-subdomains_2026-01-05_21-07-39.csv', 'r', encoding=encoding, newline='') as f:
                # Skip BOM if present
                first_line = f.readline()
                if first_line.startswith('\ufeff'):
                    f.seek(0)
                    f.readline()  # Skip BOM line
                
                f.seek(0)
                reader = csv.DictReader(f, delimiter='\t')
                
                rows_processed = 0
                for row in reader:
                    rows_processed += 1
                    try:
                        kd = int(row['KD']) if row['KD'] else 100
                        volume = int(row['Volume']) if row['Volume'] else 0
                        traffic = int(row['Organic traffic']) if row['Organic traffic'] else 0
                        position = int(row['Current position']) if row['Current position'] else 100
                        
                        # Filter: KD <= 10, Volume >= 1000, Position <= 10
                        if kd <= 10 and volume >= 1000 and position <= 10:
                            kw_data = {
                                'keyword': row['Keyword'],
                                'kd': kd,
                                'volume': volume,
                                'traffic': traffic,
                                'position': position,
                                'cpc': row.get('CPC', '0'),
                                'intent': {
                                    'informational': row.get('Informational', 'false') == 'true',
                                    'commercial': row.get('Commercial', 'false') == 'true',
                                    'transactional': row.get('Transactional', 'false') == 'true',
                                    'branded': row.get('Branded', 'false') == 'true'
                                },
                                'url': row.get('Current URL', '')
                            }
                            
                            low_kd_high_vol.append(kw_data)
                            
                            # Categorize by KD
                            if kd <= 1:
                                kd_ranges['0-1'].append(kw_data)
                            elif kd <= 3:
                                kd_ranges['2-3'].append(kw_data)
                            elif kd <= 5:
                                kd_ranges['4-5'].append(kw_data)
                            elif kd <= 7:
                                kd_ranges['6-7'].append(kw_data)
                            else:
                                kd_ranges['8-10'].append(kw_data)
                            
                            # Categorize by keyword type
                            keyword_lower = row['Keyword'].lower()
                            if 'calculator' in keyword_lower or 'calculate' in keyword_lower:
                                categories['calculators'].append(kw_data)
                            elif 'credit card' in keyword_lower or 'creditcard' in keyword_lower:
                                categories['credit_cards'].append(kw_data)
                            elif 'loan' in keyword_lower:
                                categories['loans'].append(kw_data)
                            elif 'insurance' in keyword_lower:
                                categories['insurance'].append(kw_data)
                            elif 'tax' in keyword_lower or 'w4' in keyword_lower or 'w-4' in keyword_lower:
                                categories['taxes'].append(kw_data)
                            elif 'savings' in keyword_lower or 'checking' in keyword_lower or 'banking' in keyword_lower:
                                categories['banking'].append(kw_data)
                            elif 'best time' in keyword_lower or 'when to buy' in keyword_lower or 'when do' in keyword_lower:
                                categories['shopping_timing'].append(kw_data)
                            elif keyword_lower.startswith('how') or keyword_lower.startswith('what is') or keyword_lower.startswith('what are'):
                                categories['how_to_guides'].append(kw_data)
                            elif 'vs' in keyword_lower or 'compare' in keyword_lower:
                                categories['comparisons'].append(kw_data)
                    except:
                        continue
                
                print(f"✓ Successfully read file with encoding: {encoding}")
                print(f"  Processed {rows_processed} rows\n")
                break
        except Exception as e:
            print(f"Failed with {encoding}: {str(e)[:100]}")
            continue
    
    # Sort by volume descending
    low_kd_high_vol.sort(key=lambda x: x['volume'], reverse=True)
    
    print("=" * 80)
    print("NERDWALLET KEYWORD ANALYSIS - LOW KD + HIGH VOLUME OPPORTUNITIES")
    print("=" * 80)
    print(f"\nTotal keywords found (KD <= 10, Volume >= 1000, Position <= 10): {len(low_kd_high_vol)}\n")
    
    # KD Range Breakdown
    print("=" * 80)
    print("KD RANGE BREAKDOWN")
    print("=" * 80)
    for kd_range, keywords in kd_ranges.items():
        if keywords:
            total_vol = sum(k['volume'] for k in keywords)
            total_traffic = sum(k['traffic'] for k in keywords)
            avg_pos = sum(k['position'] for k in keywords) / len(keywords)
            avg_kd = sum(k['kd'] for k in keywords) / len(keywords)
            print(f"\nKD {kd_range}:")
            print(f"  Keywords: {len(keywords)}")
            print(f"  Total Volume: {total_vol:,}")
            print(f"  Total Traffic: {total_traffic:,}")
            print(f"  Avg Position: {avg_pos:.1f}")
            print(f"  Avg KD: {avg_kd:.1f}")
    
    # Category Breakdown
    print("\n" + "=" * 80)
    print("CATEGORY BREAKDOWN")
    print("=" * 80)
    for category, keywords in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True):
        if keywords:
            total_vol = sum(k['volume'] for k in keywords)
            total_traffic = sum(k['traffic'] for k in keywords)
            avg_kd = sum(k['kd'] for k in keywords) / len(keywords)
            avg_pos = sum(k['position'] for k in keywords) / len(keywords)
            print(f"\n{category.replace('_', ' ').title()}:")
            print(f"  Keywords: {len(keywords)}")
            print(f"  Total Volume: {total_vol:,}")
            print(f"  Total Traffic: {total_traffic:,}")
            print(f"  Avg KD: {avg_kd:.1f}")
            print(f"  Avg Position: {avg_pos:.1f}")
    
    # Top Opportunities
    print("\n" + "=" * 80)
    print("TOP 50 LOW KD + HIGH VOLUME KEYWORDS (BEST OPPORTUNITIES)")
    print("=" * 80)
    for i, kw in enumerate(low_kd_high_vol[:50], 1):
        intent_str = []
        if kw['intent']['informational']: intent_str.append('Info')
        if kw['intent']['commercial']: intent_str.append('Commercial')
        if kw['intent']['transactional']: intent_str.append('Transaction')
        if kw['intent']['branded']: intent_str.append('Branded')
        
        print(f"\n{i}. {kw['keyword']}")
        print(f"   KD: {kw['kd']} | Volume: {kw['volume']:,} | Traffic: {kw['traffic']:,} | Position: {kw['position']}")
        print(f"   Intent: {', '.join(intent_str) if intent_str else 'N/A'} | CPC: ${kw['cpc']}")
        print(f"   URL: {kw['url'][:80]}...")
    
    # Best opportunities (KD 0-3, Volume 5000+)
    print("\n" + "=" * 80)
    print("BEST OPPORTUNITIES (KD 0-3, Volume 5000+)")
    print("=" * 80)
    best_opps = [k for k in low_kd_high_vol if k['kd'] <= 3 and k['volume'] >= 5000]
    best_opps.sort(key=lambda x: (x['kd'], -x['volume']))
    
    for i, kw in enumerate(best_opps[:30], 1):
        print(f"\n{i}. {kw['keyword']}")
        print(f"   KD: {kw['kd']} | Volume: {kw['volume']:,} | Traffic: {kw['traffic']:,} | Position: {kw['position']}")
    
    # Save to JSON for further analysis
    with open('nerdwallet_analysis.json', 'w') as f:
        json.dump({
            'total_keywords': len(low_kd_high_vol),
            'kd_ranges': {k: len(v) for k, v in kd_ranges.items()},
            'categories': {k: len(v) for k, v in categories.items()},
            'top_keywords': low_kd_high_vol[:100]
        }, f, indent=2)
    
    print(f"\n✓ Analysis saved to nerdwallet_analysis.json")

if __name__ == '__main__':
    analyze_keywords()

