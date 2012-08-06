from django import forms
from django.conf import settings
from geoforms.fields import TranslationField
from geoforms.models import GeoformElement
from django.template.defaultfilters import slugify

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
    
    def save(self):
        print 'radioelmentform save'
        print self.is_valid()
            
            
            