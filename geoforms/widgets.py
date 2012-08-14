from django.conf import settings
from django.forms.util import flatatt
from django.forms.widgets import MultiWidget
from django.forms.widgets import TextInput
from django.forms.widgets import Input
from django.forms.widgets import Widget
from django.template.defaultfilters import slugify
from django.utils.safestring import mark_safe

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
    
class Radiobutton(Input):
    """
    This widget is a radiobutton
    """
    input_type = 'radio'
    
class Checkbox(Input):
    """
    This widget is a radiobutton
    """
    input_type = 'checkbox'
    
    
class ColorInput(Input):
    """
    This widget is a radiobutton
    """
    input_type = 'color'
    
#smidgets with basic html

#questionnaire widgets
class Drawbutton(Widget):
    """
    This is a html button
    """
    def render(self, label, geometry_type, color, popup, attrs={}):
        if color[0] == '#':
            color = color[1:]
        final_attrs = {'data-color': color,
                       'data-popup': popup,
                       'name': slugify(label),
                       'class': 'drawbutton %s' % geometry_type}
        final_attrs.update(attrs)
        return mark_safe(u'<button type="button"%s>%s</button>' % (flatatt(final_attrs),
                                                                   label))
    
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
    
class RadiobuttonElement(Widget):
    """
    This element presents a radiobutton with a label
    """
    def render(self, label, name, value, attrs={}):
        return u'<label>%s %s</label>' % (Radiobutton().render(name,
                                                               value,
                                                               attrs),
                                          label)
    
class CheckboxElement(Widget):
    """
    This element presents a radiobutton with a label
    """
    def render(self, label, name, value, attrs={}):
        return u'<label>%s %s</label>' % (Checkbox().render(name, value, attrs),
                                          label)

#admin widgets
class TranslationWidget(MultiWidget):
    """
    This widget separates a value into translations
    fields.
    """
    
    def __init__(self, widget_class = TextInput, attrs=None):
        widget_list = ()
        
        widget_list = (widget_class(),) * len(settings.LANGUAGES)
            
        super(TranslationWidget, self).__init__(widget_list, attrs)
    
    
    def decompress(self, value):
        return [None] * len(settings.LANGUAGES)
    
    
    def format_output(self, rendered_widgets):
        rendered_with_labels = []
        for i, lang in enumerate(settings.LANGUAGES):
            rendered_with_labels.append('<label>%s [%s] %s</label>' % (lang[1],
                                                                       lang[0],
                                                                       rendered_widgets[i]))

        return ''.join(rendered_with_labels)
    
#widgets with javascript css and stuff