# Generated migration to add submitted_at field to Logbook model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logbook', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='logbook',
            name='submitted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
