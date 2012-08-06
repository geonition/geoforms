from django.conf import settings
from django.forms import CharField
from django.forms import MultiValueField
from django.forms.widgets import TextInput
from geoforms.widgets import TranslationWidget

class TranslationField(MultiValueField):
    """
    This field handles fields that needs to be translated
    """
    widget = TranslationWidget
    
    def __init__(self, *args, **kwargs):
        all_fields = ()
        for lang in settings.LANGUAGES:
            all_fields += (CharField(),)
            
        super(TranslationField, self).__init__(all_fields, *args, **kwargs)
    
    def compress(self, values_list):
        """
        This function does not do anything.
        """
        print 'compress'
        print values_list
        return values_list