from setuptools import setup
from setuptools import find_packages

setup(
    name='geoforms',
    version='6.0-dev',
    author='Kristoffer Snabb',
    url='https://github.com/geonition/geoforms',
    packages=find_packages(),
    include_package_data=True,
    package_data = {
        "geoforms": [
            "templates/*.html",
            "templates/*.api.js",
            "templates/jstranslations.txt",
            "templates/help/*.html",
            "templates/admin/geoforms/geoformelement/*.html",
            "locale/*/LC_MESSAGES/*.po",
            "locale/*/LC_MESSAGES/*.mo",
            "static/js/*",
            "static/css/*.css",
            "static/css/images/*.png"
        ],
    },
    zip_safe=False,
    install_requires=['django',
                      'django-modeltranslation<0.6',
                      'beautifulsoup4'],
)
