# -*- coding: utf-8 -*-
"""
test_pipeline.py
Run this to verify the full CareerLens pipeline from the terminal.
Usage: python test_pipeline.py
"""
import sys
import os
import requests

# ── Force UTF-8 output so ₹ renders correctly on Windows terminal ──
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
os.environ.setdefault("PYTHONIOENCODING", "utf-8")

PARSER_URL = "http://127.0.0.1:8000"
MODEL_URL  = "http://127.0.0.1:8001"

DIVIDER = "=" * 60

def check_server(name, url):
    try:
        r = requests.get(url, timeout=3)
        print(f"  ✅ {name} is UP  ({url})")
        return True
    except Exception:
        print(f"  ❌ {name} is DOWN ({url}) — start it first!")
        return False

def test_model(role="Sales Business Development Intern Project Management"):
    print(f"\n{DIVIDER}")
    print("🔍  QUERYING MODEL SERVER")
    print(f"    Role query: \"{role}\"")
    print(DIVIDER)

    try:
        resp = requests.post(
            f"{MODEL_URL}/recommend",
            json={"role": role, "top_k": 5},
            timeout=15
        )
        resp.raise_for_status()
        results = resp.json()

        print(f"\n✅  Got {len(results)} unique recommendation(s) from Railway MySQL\n")
        for item in results:
            print(f"  #{item['rank']}  {item['name']}")
            print(f"       Role     : {item['role']}")
            print(f"       Location : {item['location']}")
            print(f"       Stipend  : {item['stipend']}")
            print(f"       Match    : {item['match']}%")
            print(f"       Tags     : {', '.join(item.get('tags', []))}")
            print()
        return True
    except Exception as e:
        print(f"  ❌ Model server error: {e}")
        return False

if __name__ == "__main__":
    print(f"\n{DIVIDER}")
    print("  CareerLens AI — Pipeline Terminal Test")
    print(DIVIDER)

    print("\n📡  Checking servers...")
    parser_ok = check_server("Parser  (port 8000)", PARSER_URL)
    model_ok  = check_server("Model   (port 8001)", MODEL_URL)

    if not model_ok:
        print("\n⚠️  Start the model server first, then re-run this script.")
        sys.exit(1)

    # Allow custom role as CLI arg
    role = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Sales Business Development Intern Project Management"
    test_model(role)

    print(DIVIDER)
    print("  Test complete.")
    print(DIVIDER + "\n")
