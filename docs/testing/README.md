# Testing Evidence Directory

This directory will contain smoke test and full test results with evidence (screenshots, videos, logs).

## Directory Structure

```
testing/
├── smoke_test_YYYYMMDD/
│   ├── smoke_01_load.png
│   ├── smoke_02_camera.png
│   ├── ... (all 15 smoke test items)
│   └── smoke_test_report.md
├── full_test_YYYYMMDD/
│   ├── visual/
│   ├── functional/
│   ├── performance/
│   └── TEST_SUMMARY.md
└── README.md (this file)
```

## Instructions

After running smoke tests or full tests, create a dated subdirectory and upload all evidence files with the naming convention specified in TESTING_PLAN.md.

See `/docs/TESTING_PLAN.md` for complete testing procedures.
