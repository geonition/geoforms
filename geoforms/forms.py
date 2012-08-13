from django import forms
from django.conf import settings
from django.forms.formsets import BaseFormSet
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext as _
from geoforms.fields import TranslationField
from geoforms.models import GeoformElement
from geoforms.widgets import CheckboxElement
from geoforms.widgets import ColorInput
from geoforms.widgets import Drawbutton
from geoforms.widgets import NumberElement
from geoforms.widgets import RadiobuttonElement
from geoforms.widgets import Paragraph
from geoforms.widgets import TextElement
from geoforms.widgets import TranslationWidget

class TextElementForm(forms.Form):
    question = TranslationField()
    
    def save(self):
        if self.is_valid():
            model_values = {}
            name = slugify(self.cleaned_data['question'][0])
            for i, lang in enumerate(settings.LANGUAGES):
                question = self.cleaned_data['question'][i]
                gen_html = TextElement().render(question,
                                                name,
                                                '')
                model_values['html_%s' % lang[0]] = gen_html
                model_values['name_%s' % lang[0]] = self.cleaned_data['question'][i]
            
            GeoformElement(**model_values).save()

class NumberElementForm(TextElementForm):
    
    def save(self):
        if self.is_valid():
            model_values = {}
            name = slugify(self.cleaned_data['question'][0])
            for i, lang in enumerate(settings.LANGUAGES):
                question = self.cleaned_data['question'][i]
                gen_html = NumberElement().render(question,
                                                  name,
                                                  '')
                
                model_values['html_%s' % lang[0]] = gen_html
                model_values['name_%s' % lang[0]] = self.cleaned_data['question'][i]
            
            GeoformElement(**model_values).save()
    
class QuestionForm(forms.Form):
    """
    This is used to define the question
    for e.g. radio buttons
    """
    question = TranslationField()
    
class RadioElementForm(forms.Form):
    label = TranslationField()
            
class RadioElementFormSet(BaseFormSet):
    """
    Radio elements needs to be saved at one time
    """
    
    def save(self):
        qf = QuestionForm(self.data)
        model_values = {}
        if qf.is_valid():
            for i, lang in enumerate(settings.LANGUAGES):
                model_values['html_%s' % lang[0]] = '<p>%s</p>' % qf.cleaned_data['question'][i]
                model_values['name_%s' % lang[0]] = qf.cleaned_data['question'][i]
        
        for form in self.forms:
            
            if form.is_valid():
                for i, lang in enumerate(settings.LANGUAGES):
                    model_values['html_%s' % lang[0]] += RadiobuttonElement().render(form.cleaned_data['label'][i],
                                                                                     slugify(form.cleaned_data['label'][0]),
                                                                                     '')
                                
        GeoformElement(**model_values).save()
        
class CheckboxElementForm(forms.Form):
    label = TranslationField()
            
class CheckboxElementFormSet(BaseFormSet):
    """
    Checkbox elements needs to be saved at one time
    """
    
    def save(self):
        qf = QuestionForm(self.data)
        model_values = {}
        if qf.is_valid():
            for i, lang in enumerate(settings.LANGUAGES):
                model_values['html_%s' % lang[0]] = '<p>%s</p>' % qf.cleaned_data['question'][i]
                model_values['name_%s' % lang[0]] = qf.cleaned_data['question'][i]
        
        for form in self.forms:
            
            if form.is_valid():
                for i, lang in enumerate(settings.LANGUAGES):
                    model_values['html_%s' % lang[0]] += CheckboxElement().render(form.cleaned_data['label'][i],
                                                                                  slugify(form.cleaned_data['label'][0]),
                                                                                  '')
                                
        GeoformElement(**model_values).save()
    
class DrawButtonForm(forms.Form):
    geometry_type = forms.ChoiceField(choices = (
        ('point', _('place')),
        ('route', _('route')),
        ('area', _('area')),))
    label = TranslationField()
    color = forms.CharField(max_length = 6,
                            widget = ColorInput,
                            help_text = _('The color of the feature to be drawn. The color is given as hexadecimal color e.g. ffffff --> white, 000000 --> black, ff0000 --> red, 00ff00 --> green, 0000ff --> blue.'))
    
    def save(self):
        model_values = {}
        if self.is_valid():
            geometry_type = self.cleaned_data['geometry_type']
            popup = 'basic'
            color = self.cleaned_data['color']
            for i, lang in enumerate(settings.LANGUAGES):               
                label = self.cleaned_data['label'][i]
                gen_html = Drawbutton().render(label, geometry_type, color, popup)
                model_values['html_%s' % lang[0]] = gen_html
                model_values['name_%s' % lang[0]] = label
        
            GeoformElement(**model_values).save()

class ParagraphForm(forms.Form):
    
    text = TranslationField(field_class = forms.CharField,
                            widget = TranslationWidget(widget_class = forms.Textarea))
    
    def save(self):
        if self.is_valid():
            model_values = {}
            name = slugify(self.cleaned_data['text'][0])[:199]
            for i, lang in enumerate(settings.LANGUAGES):
                text = self.cleaned_data['text'][i]
                gen_html = Paragraph().render(text)
                
                model_values['html_%s' % lang[0]] = gen_html
                model_values['name_%s' % lang[0]] = self.cleaned_data['text'][i][:199]
            
            GeoformElement(**model_values).save()
        
        
    
