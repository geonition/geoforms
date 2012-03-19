from django.shortcuts import render_to_response
from models import Questionnaire
from forms import Geoform
from django.template import RequestContext
from django.views.generic.base import View
from django.utils.decorators import classonlymethod
from django.forms import formsets
from django.contrib.formtools.wizard.views import SessionWizardView

def questionnaire(request, questionnaire_slug):
    
    quest = Questionnaire.on_site.select_related().get(slug = questionnaire_slug)
    form_list = [form.get_form_instance() for form in quest.geoforms.all().order_by('questionnaireform__order')]
    return render_to_response('questionnaire.html',
                             {'form_list': form_list},
                             context_instance = RequestContext(request))
                             
class QuestionnaireWizard(SessionWizardView):
    template_name= 'form_template.html'
    def done(self, form_list, **kwargs):
        return render_to_response('done.html', {
            'form_data': [form.cleaned_data for form in form_list],
        })
        
    def get_form_kwargs(self, step):
        return {'definition': definitions[int(step)]}