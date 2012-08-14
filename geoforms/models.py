from django.conf import settings
from django.contrib.gis.db import models as geomodel
from django.contrib.sites.managers import CurrentSiteManager
from django.contrib.sites.models import Site
from django.core.urlresolvers import reverse
from django.db import models
from django.template.defaultfilters import slugify
from django.template.loader import render_to_string
from django.utils.translation import ugettext as _
from django.utils import timezone

class GeoformElement(models.Model):
    """
    This is one input element in a
    geoform..
    The elements of a form is written in
    HTML 5,
    
    The javascript will parse the html and
    create additional functionality and other
    required measures. The classes and data to
    pass in for widget effects is documented
    below.
    """
    slug = models.SlugField(max_length = 200,
                            editable = False,
                            unique = True)
    name = models.CharField(max_length = 200,
                            help_text = render_to_string('help/geoform_element_name.html'))
    element_type = models.CharField(max_length = 50)
    html = models.TextField(help_text = render_to_string('help/geoform_element_html.html'))

    def save(self, *args, **kwargs):
        self.slug = slugify("%s %s" % (self.name, timezone.now()))[:200]
        
        super(GeoformElement, self).save(*args, **kwargs)
    
    def __unicode__(self):
        return u'%s' % (self.name)
        
    class Meta:
        verbose_name = _('questionnaire page element')
        verbose_name_plural = _('questionnaire page elements')

class TextElementModel(GeoformElement):
    """
    This is a proxy model to handle text inputs
    separately in the admin interface.
    """
    
    def save(self, *args, **kwargs):
        self.element_type = 'text'
        
        super(TextElementModel, self).save(*args, **kwargs)
        
    class Meta:
        proxy = True
        verbose_name = _('Text input')
        verbose_name_plural = _('Text inputs')
        
class NumberElementModel(GeoformElement):
    """
    This is a proxy model for the number inputs
    """
    def save(self, *args, **kwargs):
        self.element_type = 'number'
        
        super(NumberElementModel, self).save(*args, **kwargs)

    class Meta:
        proxy = True
        verbose_name = _('Numer input')
        verbose_name_plural = _('Number inputs')
        
class Geoform(models.Model):
    """
    This is one form in a questionnaire

    fields starting with small f is for the
    form html element.
    """
    slug = models.SlugField(max_length = 50,
                                      editable = False,
                                      unique = True)
    name = models.CharField(max_length = 50)
    type = models.CharField(max_length = 5,
                            choices = (
                                ('popup', 'popup'),
                                ('form','form')),
                            default = 'form')
    elements = models.ManyToManyField(GeoformElement,
                                      through = 'FormElement')

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)

        super(Geoform, self).save(*args, **kwargs)

    def __unicode__(self):
        return u'%s - %s' % (self.name,
                             self.type)
        
    class Meta:
        verbose_name = _('questionnaire page')
        verbose_name_plural = _('questionnaire pages')


class FormElement(models.Model):
    """
    This model orders the elements in a
    form to any required order.
    """
    geoform = models.ForeignKey(Geoform)
    element = models.ForeignKey(GeoformElement)
    order = models.IntegerField(default=1)
        
    class Meta:
        verbose_name = _('page element')
        verbose_name_plural = _('page elements')
        
class Questionnaire(models.Model):
    """
    This is one questionnaire,
    """
    geoforms = models.ManyToManyField(Geoform,
                                      through = 'QuestionnaireForm',
                                      related_name = 'geoforms')
    name = models.CharField(_('name of questionnaire'),
                            max_length = 100)
    slug = models.SlugField(max_length = 100,
                            editable = False,
                            unique = True)
    area = geomodel.PolygonField(_('area of questionnaire'),
                                 srid = getattr(settings,
                                                'SPATIAL_REFERENCE_SYSTEM_ID',
                                                4326),
                                 help_text = _('This is the initial area which will be visible on the questionnaire map. The map tools are on the up right corner of the map. To choose a tool you have to click on it so that the tool turnes yellow. To draw choose the drawing tool and start drawing. To stop drawing you have to doubleclick the map. It is also possible to modify the area by choosing the modify tool. Modification works by dragging the vertexes of the area to the new modified places.'))
    site = models.ForeignKey(Site,
                             default = getattr(settings,
                                               'SITE_ID',
                                               1),
                             editable = False)

    on_site = CurrentSiteManager()
    
    def get_absolute_url(self):
        """
        Returns the absolute urls for this questionnaire for
        preview purposes.
        """
        return reverse('questionnaire',
                       kwargs = {'questionnaire_slug': self.slug})

    def save(self, *args, **kwargs):
        
        self.slug = slugify(self.name)

        super(Questionnaire, self).save(*args, **kwargs)

    def __unicode__(self):
        return u'%s' % self.name

    class Meta:
        unique_together = (("slug", "site"),)
        verbose_name = _('questionnaire')
        verbose_name_plural = _('questionnaires')

class QuestionnaireForm(models.Model):
    """
    This is the form that tells the view in which order
    the forms should be in a questionnaire.

    Also works as the manytomany relationship between
    questionnaires and forms.
    """
    questionnaire = models.ForeignKey(Questionnaire)
    geoform = models.ForeignKey(Geoform)
    order = models.IntegerField(default=1)

    def __unicode__(self):
        return u'questionnaire page'
        
    class Meta:
        verbose_name = _('questionnaire page')
        verbose_name_plural = _('questionnaire pages')
        

        





