from django.shortcuts import render_to_response
from models import Questionnaire
from django.template import RequestContext
from django.contrib.formtools.wizard.views import SessionWizardView

def questionnaire(request, questionnaire_name):

    quest = Questionnaire.on_site.select_related().get(name = questionnaire_name)
    print quest
    print quest.geoforms
    print dir(quest.geoforms)
    print quest.geoforms.values_list()
    print quest.geoforms.all()[0].elements.values_list()
    return render_to_response('questionnaire.html',
                              {'questionnaire': quest},
                              context_instance = RequestContext(request))

class QuestionnaireWizard(SessionWizardView):
    template_name= 'form_template.html'

    def done(self, form_list, **kwargs):
        return render_to_response('done.html', {
            'form_data': [form.cleaned_data for form in form_list],
        })

    def get_form_kwargs(self, step):
        return {'definition': definitions[int(step)]}
