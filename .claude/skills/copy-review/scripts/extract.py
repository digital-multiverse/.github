#!/usr/bin/env python3
"""Print every string a reader, screen reader or search engine sees in HTML pages.

Usage: extract.py page.html [page2.html …]   or   curl -s URL | extract.py -
Output: one line per string, "<file> <tag>[attr]: text", in page order.
"""
import json, sys
from html.parser import HTMLParser

SKIP = {"script", "style", "noscript", "template", "svg"}
ATTRS = ("alt", "title", "aria-label", "placeholder")
META = {"description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description"}


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.out, self.buf, self.ld, self.block = [], [], [], False, "-"

    def flush(self):
        t = " ".join("".join(self.buf).split())
        if t:
            self.out.append((self.block, t))
        self.buf = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("p", "h1", "h2", "h3", "h4", "li", "dt", "dd", "a", "button", "figcaption", "title", "summary", "td", "th", "label"):
            self.flush()
            self.block = tag
        for k in ATTRS:
            if a.get(k):
                self.out.append((f"{tag}[{k}]", a[k]))
        if tag == "meta" and (a.get("name") in META or a.get("property") in META):
            self.out.append((f"meta[{a.get('name') or a.get('property')}]", a.get("content", "")))
        if tag == "html" and a.get("lang"):
            self.out.append(("html[lang]", a["lang"]))
        self.ld = tag == "script" and a.get("type") == "application/ld+json"
        if tag == "br":
            self.buf.append(" ")
        if tag not in ("br", "img", "meta", "link", "input", "source", "hr"):
            self.stack.append(tag)

    def handle_endtag(self, tag):
        self.flush()
        if tag in self.stack:
            while self.stack and self.stack.pop() != tag:
                pass
        self.ld = False

    def handle_data(self, data):
        if self.ld:
            walk(json.loads(data), self.out)
        elif not (set(self.stack) & SKIP):
            self.buf.append(data)


def walk(node, out, key="ld"):
    if isinstance(node, dict):
        for k, v in node.items():
            if k not in ("@context", "@type", "@id", "url", "logo", "image", "sameAs", "inLanguage"):
                walk(v, out, k)
    elif isinstance(node, list):
        for v in node:
            walk(v, out, key)
    elif isinstance(node, str) and " " in node:
        out.append((f"json-ld[{key}]", node))


def extract(html):
    p = P()
    p.feed(html)
    p.flush()
    return p.out


if __name__ == "__main__":
    if len(sys.argv) == 1:
        sample = '<html lang="es"><title>T</title><p>Hola <b>mundo</b></p><img alt="Un marco"><script type="application/ld+json">{"name":"Una app bonita"}</script></html>'
        got = extract(sample)
        assert ("title", "T") in got and ("p", "Hola mundo") in got, got
        assert ("img[alt]", "Un marco") in got and ("json-ld[name]", "Una app bonita") in got, got
        print("self-check ok")
        sys.exit()
    for f in sys.argv[1:]:
        html = sys.stdin.read() if f == "-" else open(f, encoding="utf-8").read()
        for tag, text in extract(html):
            print(f"{f} {tag}: {text}")
