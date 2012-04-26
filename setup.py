from setuptools import setup
from setuptools import find_packages

setup(
    name='geoforms',
    version='4.0.0',
    author='Kristoffer Snabb',
    url='https://github.com/geonition/geoforms',
    packages=find_packages(),
    include_package_data=True,
    package_data = {
        "geoforms": [
            "templates/*.html",
            "locale/*/LC_MESSAGES/*.po",
            "locale/*/LC_MESSAGES/*.mo",
            "static/js/*",
            "static/css/*"
        ],
    },
    zip_safe=False,
    install_requires=['django'],
)
