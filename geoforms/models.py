from django.contrib.sites.managers import CurrentSiteManager
from django.contrib.sites.models import Site
from django.db import models
from django.template.defaultfilters import slugify
from forms import Geoform as Geoform_form
from django.forms.fields import CharField
from fields import ButtonField

class GeoformElement(models.Model):
    """
    This is one input element in a
    geoform..

    fields starting with a small e is for the
    HTML element
    """
    ELEMENT_TYPES = (
        ('text', 'TextInput'),
        ('button', 'Button'),
    )
    
    GEOMETRY_TYPES = (
        ('POINT', 'point'),
        ('POLYGON', 'polygon'),
        ('POLYLINE', 'polyline'),
    )

    etype = models.CharField(max_length = 30,
                            choices = ELEMENT_TYPES)
    ename = models.SlugField(default = "",
                            max_length = 30,
                            unique=True)
    eplaceholder = models.CharField(default = "",
                                    max_length = 30,
                                    blank = True)
    evalue = models.CharField(default = "",
                             blank = True,
                             max_length = 30)
    emin = models.IntegerField(blank = True,
                               default = 0)
    emax = models.IntegerField(blank = True,
                               default = 100)
    color = models.CharField(max_length = 7)
    geometry_type = models.CharField(max_length = 8,
                                     blank = True,
                                     choices = GEOMETRY_TYPES)
    label = models.CharField(max_length = 50)

    def __unicode__(self):
        return u'%s' % self.ename
    
    def get_field_instance(self):
        definition = {}
        if self.etype == 'text':
            return CharField()
        elif self.etype == 'button':
            definition['widget_attrs'] = {
                'label': self.label
            }
            #classes that are used to connect with javascript and css
            classes = ''
            if self.geometry_type == 'POINT':
                classes = 'drawbutton point'
            elif self.geometry_type == 'POLYLINE':
                classes = 'drawbutton route'
            elif self.geometry_type == 'POLYGON':
                classes = 'drawbutton area'
            
            definition['widget_attrs']['class'] = classes
                
            return ButtonField(self.ename,
                               self.evalue,
                               attrs=definition)
        else:
            return CharField()

class Geoform(models.Model):
    """
    This is one form in a questionnaire

    fields starting with small f is for the
    form html element.
    """
    fname = models.SlugField(max_length = 50)
    form_header = models.CharField(max_length = 50)
    form_text = models.TextField(blank=True)
    elements = models.ManyToManyField(GeoformElement)

    def __unicode__(self):
        return u'%s' % self.fname
    
    def get_form_instance(self):
        return Geoform_form(elements = self.elements.all(),
                            name = self.fname,
                            header = self.form_header,
                            text = self.form_text)
        
    
class Questionnaire(models.Model):
    """
    This is one questionnaire,
    """
    geoforms = models.ManyToManyField(Geoform,
                                      through = 'QuestionnaireForm',
                                      related_name = 'geoforms')
    name = models.CharField(max_length = 100)
    slug = models.SlugField(max_length = 100,
                            editable=False)
    site = models.ForeignKey(Site)

    on_site = CurrentSiteManager()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)

        super(Questionnaire, self).save(*args, **kwargs)

    def __unicode__(self):
        return u'%s' % self.name

    class Meta:
        unique_together = (("slug", "site"),)

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
        return u'questionnaire %s form %s order %s' % (
                              self.questionnaire.name,
                              self.geoform.fname,
                              self.order,)
    class Meta:
        ordering = ['order']





