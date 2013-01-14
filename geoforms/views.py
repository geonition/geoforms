from bs4 import BeautifulSoup
from django.shortcuts import render_to_response
from django.core.exceptions import ObjectDoesNotExist
from geoforms.models import Geoform
from geoforms.models import Questionnaire
from django.template import RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie

from django.conf import settings
# we need srid of the questionnaire map
#from maps.models import Map


@ensure_csrf_cookie
def questionnaire(request, questionnaire_slug):
    """
    This view creates the whole questionnaire html.
    """
    # Check if we have maps application installed, if not use geometry column srid
    try:
        from maps.models import Map
        # At the moment questionnaires always use map named questionnaire map.
        # This should not be hardcoded.
        # If named map is not found we use geometry column srid.
        map_srid = int(Map.objects.get(slug_name = 'questionnaire-map').projection)
        #take initial all transformed to map coordinates
    except (ImportError, ObjectDoesNotExist):
        #take initial all
        map_srid = None
        
    # At the moment questionnaires always use map named questionnaire map.
    # This should not be hardcoded
    #map_srid = int(Map.objects.get(slug_name = 'questionnaire-map').projection)
    
#    quest = Questionnaire.on_site.select_related().get(slug = questionnaire_slug)
    if map_srid is not None:
        quest = Questionnaire.objects.filter(
                          site__id__exact = settings.SITE_ID).transform(
                          map_srid).select_related().get(slug = questionnaire_slug)
    else:
        quest = Questionnaire.objects.filter(
                          site__id__exact = settings.SITE_ID).select_related().get(
                          slug = questionnaire_slug)
        
    form_list = quest.geoforms.all().order_by('questionnaireform__order')
    elements = {}
    popup_set = set(Geoform.objects.filter(page_type = 'popup').values_list('slug', flat=True))
    bigcontent_forms = set()
    for form in form_list:
        popup_elements = form.elements.filter(element_type = 'drawbutton').values_list('html', flat=True)

        if len(popup_elements) == 0:
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
    return render_to_response('questionnaire.html',
                             {'form_list': form_list,
                              'popup_list': popup_list,
                              'bigcontent_forms': bigcontent_forms,
                              'elements': elements,
                              'questionnaire': quest,
                              'map_slug': 'questionnaire-map'},
                             context_instance = RequestContext(request))
