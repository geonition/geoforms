from django.conf import settings
from django.forms import CharField
from django.forms import MultiValueField
from django.forms import Textarea
from django.forms import TextInput
from geoforms.widgets import TranslationWidget

class TranslationField(MultiValueField):
    """
    This field handles fields that needs to be translated
    """
    widget = TranslationWidget
    
    def __init__(self, field_class = CharField, *args, **kwargs):
        all_fields = ()
        for lang in settings.LANGUAGES:
            all_fields += (field_class(),)
            
        super(TranslationField, self).__init__(all_fields, *args, **kwargs)
    
    def compress(self, values_list):
        """
        This function does not do anything.
        """
        return values_list