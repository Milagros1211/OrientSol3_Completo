# Python-TypeScript Bridge (`bridge/`)

This module provides the RPC / serialization interface for Pyodide:
- `runner.py`: Dispatches calculation requests passed as JSON strings or Python dicts from TypeScript, runs the appropriate solar calculation pipeline, and returns JSON-formatted results.
- `validation.py`: Validates input arguments (e.g., latitude range [-90, 90], albedo in [0.05, 1.0], radiation > 0).
