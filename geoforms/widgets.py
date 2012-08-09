from django.conf import settings
from django.forms.widgets import MultiWidget
from django.forms.widgets import TextInput
from django.forms.widgets import Input
from django.forms.widgets import Widget


#basic html 5 widgets
class NumberInput(Input):
    """
    Presents a html 5 input of type number
    
    remember to pass the render function args
    for name and value and additionaly if
    required attrs=<some attrs dict>
    """
    input_type = 'number'

class Paragraph(Widget):
    """
    This class represents a simple html
    paragraph.
    """
    def render(self, text):
        return u'<p>%s</p>' % text
    
#smidgets with basic html
class NumberElement(Widget):
    """
    The NumberElement represents a number input with a label
    """
    
    def render(self, label, name, value, attrs={}):
        return u'<label>%s %s</label>' % (label,
                                          NumberInput().render(name, value))

class TextElement(Widget):
    """
    This element presents a text input with a label
    """
    def render(self, label, name, value, attrs={}):
        return u'<label>%s %s</label>' % (label,
                                          TextInput().render(name, value))

class TranslationWidget(MultiWidget):
    """
    This widget separates a value into translations
    fields.
    """
    
    def __init__(self, widget_class = TextInput, attrs=None):
        widget_list = ()
        
        for lang in settings.LANGUAGES:
            widget_list += (widget_class(),)
            
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
    
#widgets with javascript css and stuff