from bs4 import BeautifulSoup
from django.conf import settings
from django.conf.urls.defaults import patterns
from django.contrib.gis import admin
from django.core.urlresolvers import reverse
from django.forms.formsets import formset_factory
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils.translation import ugettext as _
from geoforms.forms import CheckboxElementForm
from geoforms.forms import CheckboxElementFormSet
from geoforms.forms import DrawbuttonForm
from geoforms.forms import NumberElementForm
from geoforms.forms import ParagraphForm
from geoforms.forms import RadioElementForm
from geoforms.forms import RadioElementFormSet
from geoforms.forms import TextareaForm
from geoforms.forms import TextElementForm
from geoforms.forms import QuestionForm
from geoforms.forms import RangeElementForm
from geoforms.models import CheckboxElementModel
from geoforms.models import DrawbuttonElementModel
from geoforms.models import Geoform
from geoforms.models import GeoformElement
from geoforms.models import FormElement
from geoforms.models import ParagraphElementModel
from geoforms.models import Questionnaire
from geoforms.models import QuestionnaireForm
from geoforms.models import NumberElementModel
from geoforms.models import RadioElementModel
from geoforms.models import TextElementModel
from geoforms.models import TextareaModel
from geoforms.models import RangeElementModel
from geoforms.models import PopupModel
from geoforms.models import PageModel
from modeltranslation.admin import TranslationAdmin
from modeltranslation.admin import TranslationTabularInline

class GeoformElementAdmin(TranslationAdmin, admin.ModelAdmin):
    list_display = ('name',
                    'element_type',
                    'id',
                    'html')
    ordering = ['name']
    
    def __init__(self, *args, **kwargs):
        super(GeoformElementAdmin, self).__init__(*args, **kwargs)
        sfields = ['element_type']
        for lang in settings.LANGUAGES:
            sfields.append('html_%s' % lang[0])
            
        setattr(self,
                'search_fields',
                sfields)
        

class FormElementAdmin(admin.ModelAdmin):
    ordering = ['geoform', 'order']

class ElementInline(TranslationTabularInline):
    model = FormElement
    extra = 0

class GeoformAdmin(TranslationAdmin, admin.ModelAdmin):
    list_display = ('name', 'id')
    inlines = [
        ElementInline
    ]
    
class PageAdmin(GeoformAdmin):
    """
    Page admin
    """
    def queryset(self, request):
        return self.model.objects.filter(page_type = 'form')

admin.site.register(PageModel, PageAdmin)

class PopupAdmin(GeoformAdmin):
    """
    Popup admin
    """
    def queryset(self, request):
        return self.model.objects.filter(page_type = 'popup')
    
admin.site.register(PopupModel, PopupAdmin)

class QuestionnaireFormAdmin(admin.ModelAdmin):
    ordering = ['questionnaire', 'order']

class GeoformInline(TranslationTabularInline):
    model = QuestionnaireForm
    extra = 0
        
class QuestionnaireAdmin(admin.OSMGeoAdmin, TranslationAdmin):
    list_display = ('name',)
    ordering = ['name']
    inlines = [
        GeoformInline
    ]
    default_lon = getattr(settings,
                          'ORGANIZATION_ADMIN_DEFAULT_MAP_SETTINGS',
                          {'default_lon': 0})['default_lon']
    default_lat = getattr(settings,
                          'ORGANIZATION_ADMIN_DEFAULT_MAP_SETTINGS',
                          {'default_lat': 0})['default_lat']
    default_zoom = getattr(settings,
                          'ORGANIZATION_ADMIN_DEFAULT_MAP_SETTINGS',
                          {'default_zoom': 4})['default_zoom']
    fieldsets = (
        (None, {
            'fields': ('name', 'area',)
        }),
        (_('Advanced options'), {
            'classes': ('collapse',),
            'fields': ('show_area', 'scale_visible_area',)
        }),
    )
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['slug'] = Questionnaire.on_site.get(pk = object_id).slug 
        return super(QuestionnaireAdmin, self).change_view(request, object_id,
            form_url, extra_context=extra_context)
        
    
admin.site.register(GeoformElement, GeoformElementAdmin)
admin.site.register(Questionnaire, QuestionnaireAdmin)

class TextElementAdmin(GeoformElementAdmin):
    """
    This is the admin for text inputs
    """
    form = TextElementForm

    def queryset(self, request):
        return self.model.objects.filter(element_type = 'text')

admin.site.register(TextElementModel, TextElementAdmin)

class TextareaAdmin(GeoformElementAdmin):
    """
    This is the admin for adding textareas
    """
    form = TextareaForm
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'textarea')
    
admin.site.register(TextareaModel, TextareaAdmin)

class NumberElementAdmin(GeoformElementAdmin):
    
    form = NumberElementForm
    fieldsets = (
        (None, {
            'fields': ('question',)
        }),
        (_('Advanced options'), {
            'classes': ('collapse',),
            'fields': ('min_value',
                       'max_value',
                       'step')
        }),
    )
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'number')
    
admin.site.register(NumberElementModel, NumberElementAdmin)

class RangeElementAdmin(GeoformElementAdmin):
    
    form = RangeElementForm
    fieldsets = (
        (None, {
            'fields': ('question',
                       'min_label',
                       'max_label',)
        }),
        (_('Advanced options'), {
            'classes': ('collapse',),
            'fields': ('min_value',
                       'max_value',
                       'step',
                       'initial_value',)
        }),
    )
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'range')
    
    
admin.site.register(RangeElementModel, RangeElementAdmin)

class ParagraphElementAdmin(GeoformElementAdmin):
    
    form = ParagraphForm
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'paragraph')
    
admin.site.register(ParagraphElementModel, ParagraphElementAdmin)

class DrawbuttonElementAdmin(GeoformElementAdmin):
    
    form = DrawbuttonForm
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'drawbutton')
    
admin.site.register(DrawbuttonElementModel, DrawbuttonElementAdmin)

class CheckboxElementAdmin(GeoformElementAdmin):
    
    form = CheckboxElementForm
    add_form_template = 'admin/geoforms/geoformelement/create_element.html'
    change_form_template = add_form_template
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'checkbox')
    
    def add_view(self, request, form_url='', extra_context=None):
        if request.method == 'POST':
            ces = formset_factory(CheckboxElementForm,
                                  formset=CheckboxElementFormSet)
            cs = ces(request.POST)
            cs.save()
            return HttpResponseRedirect(reverse('admin:geoforms_checkboxelementmodel_changelist'))
        else:
            return super(CheckboxElementAdmin, self).add_view(request,
                                                           form_url = '',
                                                           extra_context = {
                                                            'current_app': self.admin_site.name,
                                                            'form': QuestionForm(),
                                                            'formset': formset_factory(CheckboxElementForm)})
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        if request.method == 'POST':
            ces = formset_factory(CheckboxElementForm,
                                  formset=CheckboxElementFormSet)
            cs = ces(request.POST)
            cs.save()
            return HttpResponseRedirect(reverse('admin:geoforms_checkboxelementmodel_changelist'))
        else:
            initial_data = []
            question_data = {'question': []}
            checkboxelement = CheckboxElementModel.objects.get(id = object_id)
            
            for i, lang in enumerate(settings.LANGUAGES):
                html = getattr(checkboxelement,
                               'html_%s' % lang[0],
                               '')
                soup = BeautifulSoup(html)
                question_data['question'].append(soup.p.text.strip())
                labels = soup.find_all('label')
                label_row = {u'label': []}
                for j, label in enumerate(labels):
                    if i == 0:
                        initial_data.append({u'label': [label.text.strip()]})
                    else:
                        initial_data[j]['label'].append(label.text.strip())
            
            return super(CheckboxElementAdmin, self).change_view(request,
                                                              object_id,
                                                              form_url = '',
                                                              extra_context = {
                                                                'current_app': self.admin_site.name,
                                                                'form': QuestionForm(initial = question_data),
                                                                'formset': formset_factory(CheckboxElementForm,
                                                                                           extra = 0)(initial = initial_data)})
    
admin.site.register(CheckboxElementModel, CheckboxElementAdmin)

class RadioElementAdmin(GeoformElementAdmin):
    
    form = RadioElementForm
    add_form_template = 'admin/geoforms/geoformelement/create_element.html'
    change_form_template = add_form_template
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'radio')
    
    def add_view(self, request, form_url='', extra_context=None):
        if request.method == 'POST':
            res = formset_factory(RadioElementForm,
                                  formset=RadioElementFormSet)
            rs = res(request.POST)
            rs.save()
            return HttpResponseRedirect(reverse('admin:geoforms_radioelementmodel_changelist'))
        else:
            return super(RadioElementAdmin, self).add_view(request,
                                                           form_url = '',
                                                           extra_context = {
                                                            'current_app': self.admin_site.name,
                                                            'form': QuestionForm(),
                                                            'formset': formset_factory(RadioElementForm)})
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        if request.method == 'POST':
            res = formset_factory(RadioElementForm,
                                  formset=RadioElementFormSet)
            rs = res(request.POST)
            rs.save()
            return HttpResponseRedirect(reverse('admin:geoforms_radioelementmodel_changelist'))
        else:
            initial_data = []
            question_data = {'question': []}
            radioelement = RadioElementModel.objects.get(id = object_id)
            
            for i, lang in enumerate(settings.LANGUAGES):
                html = getattr(radioelement,
                               'html_%s' % lang[0],
                               '')
                soup = BeautifulSoup(html)
                question_data['question'].append(soup.p.text)
                labels = soup.find_all('label')
                label_row = {u'label': []}
                for j, label in enumerate(labels):
                    if i == 0:
                        initial_data.append({u'label': [label.text.strip()]})
                    else:
                        initial_data[j]['label'].append(label.text.strip())
            
            return super(RadioElementAdmin, self).change_view(request,
                                                              object_id,
                                                              form_url = '',
                                                              extra_context = {
                                                                'current_app': self.admin_site.name,
                                                                'form': QuestionForm(initial = question_data),
                                                                'formset': formset_factory(RadioElementForm,
                                                                                           extra = 0)(initial = initial_data)})
    
admin.site.register(RadioElementModel, RadioElementAdmin)


    
