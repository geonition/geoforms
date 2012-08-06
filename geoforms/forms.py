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
    value = forms.CharField()

            
class RadioElementFormSet(BaseFormSet):
    """
    Radio elements needs to be saved at one time
    """
    
    def save(self):
        print self.data
        qf = QuestionForm(self.data)
        print qf.is_valid()
        print self.is_valid()
        print qf.cleaned_data
        print self.cleaned_data
        for form in self.forms:
            print form.is_valid()
            print form.cleaned_data
        pass
    