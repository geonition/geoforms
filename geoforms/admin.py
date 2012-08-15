from bs4 import BeautifulSoup
from django.conf import settings
from django.conf.urls.defaults import patterns
from django.contrib.gis import admin
from django.core.urlresolvers import reverse
from django.forms.formsets import formset_factory
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from geoforms.forms import CheckboxElementForm
from geoforms.forms import CheckboxElementFormSet
from geoforms.forms import DrawbuttonForm
from geoforms.forms import NumberElementForm
from geoforms.forms import ParagraphForm
from geoforms.forms import RadioElementForm
from geoforms.forms import RadioElementFormSet
from geoforms.forms import TextElementForm
from geoforms.forms import QuestionForm
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
from modeltranslation.admin import TranslationAdmin
from modeltranslation.admin import TranslationTabularInline

class GeoformElementAdmin(TranslationAdmin, admin.ModelAdmin):
    list_display = ('name',
                    'element_type',
                    'id',
                    'html')
    ordering = ['name']
    
    def get_urls(self):
        urls = super(GeoformElementAdmin, self).get_urls()
        
        extra_urls = patterns('',
                            (r'^add_text_element/$', self.admin_site.admin_view(self.create_text_element)),
                            (r'^add_number_element/$', self.admin_site.admin_view(self.create_number_element)),
                            (r'^add_radio_element/$', self.admin_site.admin_view(self.create_radio_element)),
                            (r'^add_checkbox_element/$', self.admin_site.admin_view(self.create_checkbox_element)),
                            (r'^add_drawbutton_element/$', self.admin_site.admin_view(self.create_drawbutton_element)),
                            (r'^add_paragraph_element/$', self.admin_site.admin_view(self.create_paragraph_element)),
                            )
        return extra_urls + urls
    
    def create_text_element(self, request):
        if request.method == 'POST':
            TextElementForm(request.POST).save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': TextElementForm()},
                                      context_instance = RequestContext(request))
    
    def create_number_element(self, request):
        if request.method == 'POST':
            NumberElementForm(request.POST).save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': NumberElementForm()},
                                      context_instance = RequestContext(request))
    
    def create_radio_element(self, request):
        if request.method == 'POST':
            res = formset_factory(RadioElementForm,
                                  formset=RadioElementFormSet)
            rs = res(request.POST)
            rs.save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': QuestionForm(),
                                       'formset': formset_factory(RadioElementForm)},
                                      context_instance = RequestContext(request))
        
    def create_checkbox_element(self, request):
        if request.method == 'POST':
            res = formset_factory(CheckboxElementForm,
                                  formset=CheckboxElementFormSet)
            rs = res(request.POST)
            rs.save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': QuestionForm(),
                                       'formset': formset_factory(CheckboxElementForm)},
                                      context_instance = RequestContext(request))
    
    def create_drawbutton_element(self, request):
        if request.method == 'POST':
            DrawButtonForm(request.POST).save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': DrawButtonForm()},
                                      context_instance = RequestContext(request))
    
    def create_paragraph_element(self, request):
        if request.method == 'POST':
            ParagraphForm(request.POST).save()
            return HttpResponseRedirect(reverse('admin:geoforms_geoformelement_changelist'))
        else:
            return render_to_response('admin/geoforms/geoformelement/create_element.html',
                                      {'current_app': self.admin_site.name,
                                       'form': ParagraphForm()},
                                      context_instance = RequestContext(request))
        
    class Media:
        css = {
            'all': ('css/questionnaire_admin.css',)
        }

class FormElementAdmin(admin.ModelAdmin):
    ordering = ['geoform', 'order']

class ElementInline(TranslationTabularInline):
    model = FormElement
    extra = 0

class GeoformAdmin(TranslationAdmin, admin.ModelAdmin):
    list_display = ('name',)
    inlines = [
        ElementInline
    ]

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
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['slug'] = Questionnaire.on_site.get(pk = object_id).slug 
        return super(QuestionnaireAdmin, self).change_view(request, object_id,
            form_url, extra_context=extra_context)
        
    
admin.site.register(GeoformElement, GeoformElementAdmin)
admin.site.register(Geoform, GeoformAdmin)
admin.site.register(Questionnaire, QuestionnaireAdmin)

class TextElementAdmin(admin.ModelAdmin):
    """
    This is the admin for text inputs
    """
    form = TextElementForm

    def queryset(self, request):
        return self.model.objects.filter(element_type = 'text')

admin.site.register(TextElementModel, TextElementAdmin)

class NumberElementAdmin(admin.ModelAdmin):
    
    form = NumberElementForm
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'number')
    
admin.site.register(NumberElementModel, NumberElementAdmin)

class ParagraphElementAdmin(admin.ModelAdmin):
    
    form = ParagraphForm
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'paragraph')
    
admin.site.register(ParagraphElementModel, ParagraphElementAdmin)

class DrawbuttonElementAdmin(admin.ModelAdmin):
    
    form = DrawbuttonForm
    
    def queryset(self, request):
        return self.model.objects.filter(element_type = 'drawbutton')
    
admin.site.register(DrawbuttonElementModel, DrawbuttonElementAdmin)

class CheckboxElementAdmin(admin.ModelAdmin):
    
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
                question_data['question'].append(soup.p.text)
                labels = soup.find_all('label')
                label_row = {u'label': []}
                for j, label in enumerate(labels):
                    if i == 0:
                        initial_data.append({u'label': [label.text]})
                    else:
                        initial_data[j]['label'].append(label.text)
            
            return super(CheckboxElementAdmin, self).change_view(request,
                                                              object_id,
                                                              form_url = '',
                                                              extra_context = {
                                                                'current_app': self.admin_site.name,
                                                                'form': QuestionForm(initial = question_data),
                                                                'formset': formset_factory(CheckboxElementForm,
                                                                                           extra = 0)(initial = initial_data)})
    
admin.site.register(CheckboxElementModel, CheckboxElementAdmin)

class RadioElementAdmin(admin.ModelAdmin):
    
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
                        initial_data.append({u'label': [label.text]})
                    else:
                        initial_data[j]['label'].append(label.text)
            
            return super(RadioElementAdmin, self).change_view(request,
                                                              object_id,
                                                              form_url = '',
                                                              extra_context = {
                                                                'current_app': self.admin_site.name,
                                                                'form': QuestionForm(initial = question_data),
                                                                'formset': formset_factory(RadioElementForm,
                                                                                           extra = 0)(initial = initial_data)})
    
admin.site.register(RadioElementModel, RadioElementAdmin)


    
