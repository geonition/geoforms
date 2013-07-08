from django import template
from django.template.defaultfilters import stringfilter

import random
from bs4 import BeautifulSoup

register = template.Library()

@register.filter(is_safe=True)
@stringfilter
def randomize_cb_rb(value, user):
    soup = BeautifulSoup(value)
    title = soup('p')
    cbs = soup(attrs={"data-random": "true"})
    if not cbs:
        return value
    for cb in cbs: del cb['data-random']
    cbs = [cb.find_parent('label') for cb in cbs]
    random.seed(user.id)
    random.shuffle(cbs)
    return unicode(title[0]) + ''.join([unicode(w) for w in cbs])
