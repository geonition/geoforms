from bs4 import BeautifulSoup
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.utils import simplejson as json
from geoforms.models import Geoform
from geoforms.models import Questionnaire
from django.template import RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import date
from geonition_utils.http import HttpResponse
from django.utils.translation import ugettext as _


@ensure_csrf_cookie
def questionnaire(request, questionnaire_slug, template=''):
    """
    This view creates the whole questionnaire html.
    """

    quest = Questionnaire.on_site.select_related().get(slug = questionnaire_slug)

    form_list = quest.geoforms.all().order_by('questionnaireform__order')
    elements = {}
    #popup_set = set(Geoform.objects.filter(page_type = 'popup').values_list('slug', flat=True))
    popup_set = set()
    bigcontent_forms = set()
    for form in form_list:
        popup_elements = form.elements.filter(element_type = 'drawbutton').values_list('html', flat=True)
        wms_elements = form.elements.filter(element_type = 'wms-layer')

        if len(popup_elements) == 0 and len(wms_elements) == 0:
            bigcontent_forms.add(form.name)

        for e in popup_elements:
            soup = BeautifulSoup(e)
            popup_set.add(soup.button['data-popup'])

        elements[form.slug] = form.elements.order_by('formelement__order', '?')

    popup_list = Geoform.objects.filter(page_type = 'popup').filter(slug__in = popup_set)

    #add the popup elements to elements
    for popupform in popup_list:
        elements[popupform.slug] = popupform.elements.order_by('formelement__order', '?')

    form_list = form_list.filter(page_type = 'form')
    if not template:
        template = 'questionnaire.html'
    return render_to_response(template,
                             {'form_list': form_list,
                              'popup_list': popup_list,
                              'bigcontent_forms': bigcontent_forms,
                              'elements': elements,
                              'questionnaire': quest,
                              'map_slug': 'questionnaire-map'},
                             context_instance = RequestContext(request))

def get_active_questionnaires(request):
    today = date.today()
    active_quests = Questionnaire.on_site.filter(start_date__lte=today).filter(end_date__gte=today)
    questionnaires = []
    for quest in active_quests:
        cur_quest = {}
        cur_feature = {"type": "Feature",
                       "id": quest.id,
                       "geometry": json.loads(quest.area.json),
                       "crs": {"type": "name",
                              "properties": {
                                  "code": "EPSG:" + str(quest.area.srid)
                             }}
                       }
        cur_quest['name'] = quest.name
        cur_quest['description'] = quest.description
        cur_quest['area'] = cur_feature
        cur_quest['project_url'] = reverse('questionnaire', kwargs={'questionnaire_slug': quest.slug})
#        cur_quest['link_text'] = _('Go to the application..')
        questionnaires.append(cur_quest)

    return HttpResponse(json.dumps({'projectType': 'questionnaires',
                                    'content': questionnaires}))
#    return HttpResponse(json.dumps(questionnaires))


def feedback(request, questionnaire_slug):
    return questionnaire(request, questionnaire_slug, 'questionnaire_feedback.html')
