from django import forms
from django.conf import settings
from django.forms.formsets import BaseFormSet
from django.template.defaultfilters import slugify
from geoforms.fields import TranslationField
from geoforms.models import GeoformElement

class TextElementForm(forms.Form):
    question = TranslationField()
    
    def save(self):
        if self.is_valid():
            model_values = {}
            for i, lang in enumerate(settings.LANGUAGES):
                question = self.cleaned_data['question'][i]
                name = slugify(question)
                gen_html = '<label>%s<input type="text" name="%s" /></label>' % (question,
                                                                                 name)
                if lang[0] == settings.LANGUAGE_CODE or i == 0:
                    model_values['html'] = gen_html
                    model_values['name'] = name
                
                model_values['html_%s' % lang[0]] = gen_html
            
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
                    model_values['html_%s' % lang[0]] += '<label><input type="radio" name="%s" />%s</label>' % (slugify(form.cleaned_data['label'][0]),
                                                                                                                form.cleaned_data['label'][i])
                                
        GeoformElement(**model_values).save()