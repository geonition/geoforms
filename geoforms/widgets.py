from django.conf import settings
from django.forms.util import flatatt
from django.forms.widgets import MultiWidget
from django.forms.widgets import TextInput
from django.forms.widgets import Textarea
from django.forms.widgets import Widget
from django.template.defaultfilters import slugify
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext as _
from django.utils.html import format_html
from geonition_utils.widgets import ColorInput
from geonition_utils.widgets import NumberInput
from geonition_utils.widgets import Paragraph
from geonition_utils.widgets import RangeInput
from geonition_utils.widgets import Radiobutton
from geonition_utils.widgets import Checkbox

#smidgets with basic html

#questionnaire widgets
class Drawbutton(Widget):
    """
    This is a html button
    """
    def render(self, label, geometry_type, color, popup, max_amount, attrs={}):
        final_attrs = {'data-color': color,
                       'data-popup': popup,
                       'data-max': max_amount,
                       'name': slugify(label),
                       'class': 'drawbutton %s' % geometry_type}
        final_attrs.update(attrs)
        symbol = ''
        if geometry_type == 'point':
            symbol = '<img src="/images/svg/place_marker.svg?color=%s" alt="%s" />' % (color[1:],
                                                                                       _('place icon'))
        elif geometry_type == 'route':
            symbol = '<img src="/images/svg/route_marker.svg?color=%s" alt="%s" />' % (color[1:],
                                                                                       _('route icon'))
        elif geometry_type == 'area':
            symbol = '<img src="/images/svg/area_marker.svg?color=%s" alt="%s" />' % (color[1:],
                                                                                       _('area icon'))


        return mark_safe(u'<button type="button"%s>%s %s</button>' % (flatatt(final_attrs),
                                                                      symbol,
                                                                      label))

class NumberElement(Widget):
    """
    The NumberElement represents a number input with a label
    """
    def render(self, label, name, value, attrs={}):
        return u'<label>%s %s</label>' % (label,
                                          NumberInput().render(name,
                                                               value,
                                                               attrs = attrs))

class RangeElement(Widget):
    """
    The RangeElement represents a range input with a question, min and max labels to be
    set on the left and right side of the slider/range
    """
    def render(self, question, min_label, max_label, name, value, attrs={}):
        s = u'<span class="range-min-label">%s</span>%s<span class="range-max-label">%s</span>' % (min_label,
                                                              RangeInput().render(name, value, attrs=attrs),
                                                              max_label)
        if question:
            s = (u'<p>%s</p>' % question) + s
        s = u'<div class="range-container">' + s + u'</div>'
        return s

class TextElement(Widget):
    """
    This element presents a text input with a label
    """
    def render(self, label, name, value, attrs={}):
        return u'<label>%s %s</label>' % (label,
                                          TextInput().render(name, value))

class TextareaElement(Widget):
    """
    This widget is a question requiring a text area.
    """
    def render(self, label, name, value, attrs={}):
        return u'<label>%s %s</label>' % (label,
                                          Textarea().render(name, value))

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
            rendered_with_labels.append('<span>%s [%s]</span> %s' % (lang[1],
                                                                       lang[0],
                                                                       rendered_widgets[i]))

        return ''.join(rendered_with_labels)

#widgets with javascript css and stuff
