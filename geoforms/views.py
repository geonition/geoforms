from django.shortcuts import render_to_response
from models import Questionnaire

def questionnaire(request, questionnaire_name):
    
    q = Questionnaire.objects.select_related().get(name = questionnaire_name)
    print q
    print dir(q)
    return render_to_response('questionnaire.html',
                              {'q': q})
    
class QuestionnaireWizard(SessionWizardView):
    template_name= 'form_template.html'
    def done(self, form_list, **kwargs):
        return render_to_response('done.html', {
            'form_data': [form.cleaned_data for form in form_list],
        })
        
    def get_form_kwargs(self, step):
        return {'definition': definitions[int(step)]}