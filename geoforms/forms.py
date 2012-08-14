import abc
from bs4 import BeautifulSoup
from django import forms
from django.conf import settings
from django.forms.formsets import BaseFormSet
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext as _
from geoforms.fields import TranslationField
from geoforms.models import GeoformElement
from geoforms.models import NumberElementModel
from geoforms.models import TextElementModel
from geoforms.widgets import CheckboxElement
from geoforms.widgets import ColorInput
from geoforms.widgets import Drawbutton
from geoforms.widgets import NumberElement
from geoforms.widgets import RadiobuttonElement
from geoforms.widgets import Paragraph
from geoforms.widgets import TextElement
from geoforms.widgets import TranslationWidget

#element admin forms
class ElementForm(forms.ModelForm):
    """
    This is a base class for input elements
    of the form <label>label <input .../></label>
    """
    
    question = TranslationField()
    
    def __init__(self, *args, **kwargs):
        """
        The init function parses through the saved
        html and sets the correct initial
        values for the form.
        """
        
        super(ElementForm, self).__init__(*args, **kwargs)
 
        # Set the form fields based on the model object
        if kwargs.has_key('instance'):
            initial_values = []
            for lang in settings.LANGUAGES:
                soup = BeautifulSoup(getattr(kwargs['instance'],
                                             'html_%s' % lang[0]))
                initial_values.append(soup.label.text)
            
            self.initial['question'] = initial_values
    
    def save(self, commit=True):
        """
        This function saves the elements
        """
        model = super(ElementForm, self).save(commit=False)
 
        if self.is_valid():
            name = slugify(self.cleaned_data['question'][0])
            for i, lang in enumerate(settings.LANGUAGES):
                question = self.cleaned_data['question'][i]
                gen_html = self.render(question,
                                       name,
                                       '')
                setattr(model, 'html_%s' % lang[0],
                        gen_html)
                setattr(model, 'name_%s' % lang[0],
                        self.cleaned_data['question'][i])
            
        # Save the fields
        if commit:
            model.save()
            
        return model

    @abc.abstractmethod
    def render(self,
               question,
               name,
               value):
        """
        This function has to be overridden to
        render the element
        """
        return ''
    
class TextElementForm(ElementForm):
    """
    This modelform is used in the admin to
    be able to add textinputs and
    also modify them.
    """
    
    def render(self, question, name, value):
        return TextElement().render(question,
                                    name,
                                    value)
        
    class Meta:
        model = TextElementModel
        fields = ('question',)

class NumberElementForm(ElementForm):
    
    def render(self, question, name, value):
        return NumberElement().render(question,
                                      name,
                                      value)
     
    class Meta:
        model = NumberElementModel
        fields = ('question',)

#bascic admin forms    
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
        qform = QuestionForm(self.data)
        model_values = {}
        if qform.is_valid():
            for i, lang in enumerate(settings.LANGUAGES):
                model_values['html_%s' % lang[0]] = '<p>%s</p>' % qform.cleaned_data['question'][i]
                model_values['name_%s' % lang[0]] = qform.cleaned_data['question'][i]
        
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
        qform = QuestionForm(self.data)
        model_values = {}
        if qform.is_valid():
            for i, lang in enumerate(settings.LANGUAGES):
                model_values['html_%s' % lang[0]] = '<p>%s</p>' % qform.cleaned_data['question'][i]
                model_values['name_%s' % lang[0]] = qform.cleaned_data['question'][i]
        
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
    color = forms.CharField(max_length = 7,
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
        """
        This function saves the paragraph
        """
        if self.is_valid():
            model_values = {}
            for i, lang in enumerate(settings.LANGUAGES):
                text = self.cleaned_data['text'][i]
                gen_html = Paragraph().render(text)
                
                model_values['html_%s' % lang[0]] = gen_html
                model_values['name_%s' % lang[0]] = self.cleaned_data['text'][i][:200]
            
            GeoformElement(**model_values).save()
        
        
    
