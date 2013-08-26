from geoforms.models import Geoform
from geoforms.models import GeoformElement
from geoforms.models import FormElement
from geoforms.models import Questionnaire
from geoforms.models import QuestionnaireForm
from bs4 import BeautifulSoup
from django.conf import settings

def copyGeoform(g_id):
    geoform = Geoform.objects.get(id=g_id)
    old_elements_and_orders = [(fe.element.id,fe.order) for fe in FormElement.objects.filter(geoform=geoform)]
    new_elements_and_orders = [(copyGeoformElement(e[0]),e[1]) for e in old_elements_and_orders]
    geoform.pk = None
    geoform.id = None
    geoform.slug = ''
    geoform.save()
    for e in new_elements_and_orders:
        element = GeoformElement.objects.get(id=e[0])
        FormElement(geoform=geoform,element=element,order=e[1]).save() 
    return geoform.id

def copyGeoformElement(ge_id):
    ge = GeoformElement.objects.get(id=ge_id)
    ge.pk = None
    ge.id = None
    ge.slug = ''
    ge.save()
    if ge.element_type == 'drawbutton':
        html = BeautifulSoup(ge.html).button
        old_popup = Geoform.objects.get(slug=html['data-popup'])
        new_popup = Geoform.objects.get(id=copyGeoform(old_popup.id))
        for i, lang in enumerate(settings.LANGUAGES):
            local_html = BeautifulSoup(getattr(ge,'html_%s' % lang[0],'')).button
            local_html['data-popup'] = new_popup.slug
            setattr(ge,'html_%s' % lang[0],str(local_html))
        ge.save()
    return ge.id

def copyQuestionnaire(q_id):
    questionnaire = Questionnaire.objects.get(id=q_id)
    old_forms_and_orders = [(qf.geoform.id, qf.order) for qf in QuestionnaireForm.objects.filter(questionnaire=questionnaire)]
    new_forms_and_orders = [(copyGeoform(f[0]), f[1]) for f in old_forms_and_orders]
    questionnaire.pk = None
    questionnaire.id = None
    questionnaire.slug = ''
    questionnaire.save()
    for f in new_forms_and_orders:
        geoform = Geoform.objects.get(id=f[0])
        QuestionnaireForm(questionnaire=questionnaire,geoform=geoform,order=f[1]).save() 
    return questionnaire.id

