from django.contrib.sites.managers import CurrentSiteManager
from django.contrib.sites.models import Site
from django.db import models
from django.template.defaultfilters import slugify

class GeoformElement(models.Model):
    """
    This is one input element in a
    geoform..

    fields starting with a small e is for the
    HTML element
    """
    ELEMENT_TYPES = (
        ('text', 'Text'),
        ('email', 'E-mail'),
        ('datetime', 'Date and Time'),
        ('date', 'Date'),
        ('number', 'Number'),
        ('range', 'Range'),
        ('checkbox', 'Checkbox'),
        ('radio', 'Radio button'),
        ('button', 'Button'),
    )

    etype = models.CharField(max_length = 30,
                            choices = ELEMENT_TYPES)
    ename = models.CharField(default = "",
                            max_length = 30)
    evalue = models.CharField(default = "",
                             blank = True,
                             max_length = 30)
    emin = models.IntegerField(default = 0)
    emax = models.IntegerField(default = 100)

    def __unicode__(self):
        return u'%s' % self.ename

class Geoform(models.Model):
    """
    This is one form in a questionnaire

    fields starting with small f is for the
    form html element.
    """
    fname = models.CharField(max_length=50)
    elements = models.ManyToManyField(GeoformElement)

    def __unicode__(self):
        return u'%s' % self.fname

class Questionnaire(models.Model):
    """
    This is one questionnaire,
    """
    geoforms = models.ManyToManyField(Geoform,
                                      through = 'QuestionnaireForm',
                                      related_name='geoforms')
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





