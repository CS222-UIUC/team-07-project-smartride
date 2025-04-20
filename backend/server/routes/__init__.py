import importlib
import pkgutil
from types import ModuleType
from flask import Flask

def register_all_routes(app: Flask):
    package_name = __name__  # 'server.routes'
    package_path = __path__  # filesystem path list to 'routes' package

    for _, module_name, _ in pkgutil.iter_modules(package_path):
        full_module_name = f"{package_name}.{module_name}"
        try:
            module: ModuleType = importlib.import_module(full_module_name)
            register_func_name = f"register_{module_name}_routes"
            if hasattr(module, register_func_name):
                getattr(module, register_func_name)(app, '/api')
        except Exception as e:
            raise RuntimeError(f"Failed to register routes from {full_module_name}: {e}")