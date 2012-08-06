from django.conf import settings
from django.forms.widgets import MultiWidget
from django.forms.widgets import TextInput
from django.forms.widgets import Select
from django.utils.safestring import mark_safe
from django.forms.util import flatatt
from bs4 import BeautifulSoup

class TranslationWidget(MultiWidget):
    """
    This widget separates a value into translations
    fields.
    """
    
    def __init__(self, attrs=None):
        widget_list = ()
        
        for lang in settings.LANGUAGES:
            widget_list += (TextInput(),)
            
        super(TranslationWidget, self).__init__(widget_list, attrs)
    
    
    def decompress(self, value):
        print 'decompress'
        print value        
        return [None for lang in settings.LANGUAGES]
    
    def format_output(self, rendered_widgets):
        rendered_with_labels = []
        for i, lang in enumerate(settings.LANGUAGES):
            rendered_with_labels.append('<label>%s [%s] %s</label>' % (lang[1],
                                                                       lang[0],
                                                                       rendered_widgets[i]))

        return ''.join(rendered_with_labels)