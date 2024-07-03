# Generated by Django 3.2.12 on 2024-07-02 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20240626_1230'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrendingCoins',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('currencyCode', models.CharField(max_length=20)),
                ('cryptoCurrency', models.CharField(max_length=20)),
                ('symbol', models.CharField(max_length=5)),
                ('price', models.FloatField()),
                ('change_24h', models.FloatField()),
                ('marketCap', models.FloatField()),
                ('volume_24h', models.FloatField()),
                ('icon', models.URLField(blank=True, null=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='marketrate',
            name='symbol',
            field=models.CharField(default='btc', max_length=5),
        ),
        migrations.AlterField(
            model_name='cachedofferdata',
            name='cryptoCurrency',
            field=models.CharField(choices=[('BTC', 'Bitcoin'), ('ETH', 'Ethereum'), ('SOL', 'Solana')], default='BTC', max_length=30),
        ),
        migrations.AlterField(
            model_name='cachedofferdata',
            name='currency',
            field=models.CharField(choices=[('USD', 'United States dollar'), ('EUR', 'Euro'), ('GPB', 'Pound Sterling'), ('NGN', 'Nigerian Naira'), ('AUD', 'Australian dollar')], default='USD', max_length=30),
        ),
    ]
