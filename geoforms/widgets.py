from django.conf import settings
from django.forms.widgets import MultiWidget
from django.forms.widgets import TextInput
from django.forms.widgets import Input


#basic html 5 widgets
class NumberInput(Input):
    """
    Presents a html 5 input of type number
    
    remember to pass the render function args
    for name and value and additionaly if
    required attrs=<some attrs dict>
    """
    input_type = 'number'

#smidgets with basic html

#used in the questionnaire

#used for the admin
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
        return [None for lang in settings.LANGUAGES]
    
    def format_output(self, rendered_widgets):
        rendered_with_labels = []
        for i, lang in enumerate(settings.LANGUAGES):
            rendered_with_labels.append('<label>%s [%s] %s</label>' % (lang[1],
                                                                       lang[0],
                                                                       rendered_widgets[i]))

        return ''.join(rendered_with_labels)