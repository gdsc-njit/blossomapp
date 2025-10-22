import csv
import re
from html import unescape
from typing import Optional


IMG_SRC_RE = re.compile(r'<img\s+[^>]*src=(?:"([^"]+)"|\'([^\']+)\')', re.IGNORECASE)
TAG_RE = re.compile(r'<[^>]+>')


def extract_img_src(html: str) -> Optional[str]:
    if not html:
        return None
    m = IMG_SRC_RE.search(str(html))
    if not m:
        return None
    return m.group(1) or m.group(2)


def strip_tags(text: str) -> str:
    if text is None:
        return ''
    t = unescape(str(text))
    return TAG_RE.sub('', t).strip()


SIZE_KEYWORDS = {
    'small': ['small', "< 10'", "<10'", "less than 10", "less than 10'", "anything less than 10", "small:"],
    'medium': ['medium', "10' and 25'", "between 10' and 25'", "between 10 and 25", "between 10' and 25' in length", "between 10' and 25' in length", "anything less than 1’", "anything less than 1'", "anything less than 1"],
    'large': ['large', "25' and 50'", "between 25' and 50'", "between 25' and 50' in length", "between 25' and 50' in length", "1’ – 2’", "1’ – 2’ Diameter", "1\' – 2\'"],
    'extra large': ['very large', '>50', ">50'", "greater than 50", "more than 50", 'very large: >50', '>2’', '>2\'']
}


def normalize_size(value: str) -> str:
    if not value:
        return ''
    s = str(value).lower()
    for canonical, keywords in SIZE_KEYWORDS.items():
        for kw in keywords:
            if kw in s:
                return canonical
    try:
        nums = re.findall(r"(\d+)", s)
        if nums:
            n = int(nums[0])
            if n < 10:
                return 'small'
            if 10 <= n < 25:
                return 'medium'
            if 25 <= n <= 50:
                return 'large'
            if n > 50:
                return 'extra large'
    except Exception:
        pass
    return ''


def main(infile: str = 'trees2.csv', outfile: str = 'trees_cleaned.csv') -> None:
    with open(infile, newline='', encoding='utf-8') as f:
        sample = f.read(4096)
        f.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample)
        except Exception:
            dialect = csv.get_dialect('excel')
        reader = csv.DictReader(f, dialect=dialect)

        rows = list(reader)

    out_fields = ["X", "Y", "Name", "Description", "Date", "Zone", "Diameter", "Length", "Image"]
    out_rows = []
    for r in rows:
        desc = r.get('Description', '')
        image = (r.get('Image') or '').strip()
        if not image:
            image = extract_img_src(desc)
        clean_desc = strip_tags(desc)
        out_row = {
            'X': r.get('X', ''),
            'Y': r.get('Y', ''),
            'Name': r.get('Name', ''),
            'Description': clean_desc,
            'Date': r.get('Date', ''),
            'Zone': r.get('Zone', ''),
            'Diameter': normalize_size(r.get('Diameter', '')),
            'Length': normalize_size(r.get('Length', '')),
            'Image': image or ''
        }
        out_rows.append(out_row)

    with open(outfile, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=out_fields)
        writer.writeheader()
        writer.writerows(out_rows)

    print(f'Processed {len(out_rows)} rows and wrote {outfile}')


if __name__ == '__main__':
    main()
