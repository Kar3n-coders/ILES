#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
# placements.0004 adds a column that already exists in prod DB from a prior unmigrated deploy
python manage.py migrate placements 0004 --fake
python manage.py migrate
