from django.forms.widgets import Input
from django.forms.widgets import Widget
from django.utils.safestring import mark_safe
from django.forms.util import flatatt

class NumberInput(Input):
    input_type = 'number'
    
class Button(Widget):
    """
    This is a button widget to present a html button.
    
    give as an attribute a label and it will be shown as the
    buttontext.
    """
    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        
        final_attrs = self.build_attrs(attrs)
        label = final_attrs.pop('label', '')
        
        if value != '':
            final_attrs['value'] = force_unicode(self._format_value(value))
        
        return mark_safe(u'<button%s>%s</button>' % (flatatt(final_attrs),
                                                     label))