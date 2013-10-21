from bs4 import BeautifulSoup
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.utils import simplejson as json
from geoforms.models import Geoform
from geoforms.models import Questionnaire
from geoforms.models import Lottery,LotteryParticipant
from geoforms.forms import LotteryForm
from django.template import RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import date
from geonition_utils.http import HttpResponse
from django.utils.translation import ugettext as _
from django.utils.translation import get_language
from django.utils.translation import to_locale
from django.core.cache import cache
from django.conf import settings


@ensure_csrf_cookie
def lottery(request, questionnaire_id):
    if request.POST:
        questionnaire = Questionnaire.objects.get(id=questionnaire_id)
        participant = LotteryParticipant(
                email=request.body,
                questionnaire=questionnaire)
        participant.save()
        return HttpResponse('success')
    else:
        form = LotteryForm()
        return HttpResponse(form.as_p())



@ensure_csrf_cookie
def questionnaire(request, questionnaire_id, template='', no_save=''):
    """
    This view creates the whole questionnaire html.
    By default response of this view is cached in Django.
    To turn cache off comment line 94.
    If you want to use the cache choose cache backend of your choice,
    see Django documentation.
    """

    try:
        quest = Questionnaire.on_site.select_related().get(id = questionnaire_id)
    except ObjectDoesNotExist:
        return render_to_response('geoforms_error.html',{'error_message':'Questionnaire not found'},context_instance=RequestContext(request))
    q_id = quest.id
    # Check if cached version is available
    lang = to_locale(get_language()).lower() #
    cache_id = 'questionnaire_resp_{0}_{1}'.format(request.META['HTTP_HOST'],lang)
    use_cache = False
    if not getattr(settings,'DEBUG',False) and no_save == '' and template == '' and not request.user.is_authenticated():
        use_cache = True
    if use_cache and cache.get(cache_id, version=q_id) is not None:
        return cache.get(cache_id, version=q_id)

    form_list = quest.geoforms.all().order_by('questionnaireform__order')
    elements = {}
    #popup_set = set(Geoform.objects.filter(page_type = 'popup').values_list('id', flat=True))
    popup_set = set()
    bigcontent_forms = set()
    geojsonpopup_forms = form_list.filter(page_type = 'gpop')
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
    lottery = Lottery.objects.filter(questionnaire=quest)
    if lottery.exists():
        lottery = lottery[0]
    resp =  render_to_response(template,
                             {'form_list': form_list,
                              'popup_list': popup_list,
                              'bigcontent_forms': bigcontent_forms,
                              'geojsonpopup_forms': geojsonpopup_forms,
                              'elements': elements,
                              'questionnaire': quest,
                              'map_slug': 'questionnaire-map',
                              'no_save' : no_save,
                              'CITIES_WITH_ZOOMABLE_DISTRICTS' : getattr(settings,'CITIES_WITH_ZOOMABLE_DISTRICTS',''),
                              'ADD_CANNOT_SAY_TO_RANGE_ELEMENTS' : getattr(settings,'ADD_CANNOT_SAY_TO_RANGE_ELEMENTS',False),
                              'lottery' : lottery,
                              'lottery_form' : LotteryForm()},
                             context_instance = RequestContext(request))
    # Cache the response. To turn cache off comment the following line
    if use_cache:
        cache.set(cache_id, resp, 300, version=q_id)
    return resp

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
        cur_quest['project_url'] = reverse('questionnaire', kwargs={'questionnaire_id': quest.id})
#        cur_quest['link_text'] = _('Go to the application..')
        questionnaires.append(cur_quest)

    return HttpResponse(json.dumps({'projectType': 'questionnaires',
                                    'content': questionnaires}))


def no_save(request, questionnaire_id):
    return questionnaire(request, questionnaire_id,'','no_save')

def feedback(request, questionnaire_id):
    return questionnaire(request, questionnaire_id, 'questionnaire_feedback.html')

