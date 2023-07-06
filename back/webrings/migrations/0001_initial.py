# Generated by Django 4.2.2 on 2023-07-06 00:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import webrings.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('name', models.CharField(max_length=36, unique=True)),
                ('account_type', models.CharField(choices=[('free', 'Free'), ('subscriber', 'Subscriber')], default='free', max_length=12)),
                ('date_updated', models.DateTimeField(auto_now=True, validators=[webrings.validators.validate_date_not_in_future])),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(max_length=500)),
                ('url', models.URLField(validators=[webrings.validators.validate_https_url])),
                ('date_created', models.DateTimeField(auto_now_add=True, validators=[webrings.validators.validate_date_not_in_future])),
                ('date_updated', models.DateTimeField(auto_now=True, validators=[webrings.validators.validate_date_not_in_future])),
                ('primary', models.BooleanField(default=False)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='account', related_query_name='account', to='webrings.account')),
            ],
        ),
        migrations.CreateModel(
            name='Webring',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(max_length=500)),
                ('date_created', models.DateTimeField(auto_now_add=True, validators=[webrings.validators.validate_date_not_in_future])),
                ('date_updated', models.DateTimeField(auto_now=True, validators=[webrings.validators.validate_date_not_in_future])),
                ('automatic_approval', models.BooleanField(default=False)),
                ('primary', models.BooleanField(default=False)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='webrings', related_query_name='webrings', to='webrings.account')),
            ],
        ),
        migrations.CreateModel(
            name='WebringPageLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approved', models.BooleanField(default=False)),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webrings.page')),
                ('webring', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webrings.webring')),
            ],
        ),
        migrations.AddField(
            model_name='page',
            name='webrings',
            field=models.ManyToManyField(blank=True, related_name='page_links', related_query_name='page_links', through='webrings.WebringPageLink', to='webrings.webring'),
        ),
    ]
