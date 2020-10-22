from django.db import models


class User(models.Model):
    email = models.CharField(max_length=20)
    pas = models.CharField(max_length=20)
    pas2 = models.CharField(max_length=20)

    def __str__(self):
        return self.email, self.pas, self.pas2
