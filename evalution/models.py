from django.db import models
from django.conf import settings
from placements.models import InternshipPlacement
 
class EvaluationCriteria(models.Model):
    """
    Example criteria:
    - Punctality (0.40)
    -Technical Skills (0.30)
    -Initiative (0.30)
    """ 
    name = models.CharField(max_length=100)
    weight = models.FloatField(help_text="Weight as decimal e.g  0.40 for 40%")

    def __str__(self):
        return f"{self.name} ({self.weight *100}%)"

class Evaluation(models.Model):
   
   EVALUTOR_TYPE = [
      ('workplace', 'Workplace Supervisor'),
      ('academec', 'Academic Supervisor'),
   ]

   placement = models.ForeignKey(
      InternshipPlacement,
      on_delete=models.CASCADE,
      related_name='Evaluations'
   )

   evalutor = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='Evaluations_given'
   )

   evalutor_type = models.CharField(
      max_length=20,
      choices=EVALUTOR_TYPE
   )

   criteria = models.FloatField(
       help_text="Score given by supervisor (example 1-5)"
   )

   weighted_score = models.FloatField(
       blank=True,
       null=True
   )

   is_finalised = models.BooleanField(default=False)

   evaluated_at = models.DateTimeField(auto_now_add=True)

   class Meta:
       unique_together = ('placement', 'evalutor', 'criteria')
    
   def save(self, *args, **kwargs):
       #calculate weighted score automatically
       self.weighted_score = self.score * self.criteria.weight
       super().save(*args, **kwargs)
    
   def __str__(self):
       return F"{self.evaluator.uspername} - {self.criteria.name} ({self.score})"




   
        

# Create your models here.
