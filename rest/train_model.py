from pathlib import Path
import json
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

DATA = Path('data/players.csv.gz')
OUT = Path('model_baseline.json')

df = pd.read_csv(DATA)
df['age'] = (pd.Timestamp.today() - pd.to_datetime(df.date_of_birth)).dt.days / 365.25
df = df[(df.market_value_in_eur > 0) & df.age.between(16, 40)].copy()
df['log_value'] = df.market_value_in_eur.clip(lower=100_000).map(__import__('math').log)
features = ['age', 'position', 'sub_position', 'international_caps', 'international_goals', 'height_in_cm']
pre = ColumnTransformer([('num', SimpleImputer(strategy='median'), ['age','international_caps','international_goals','height_in_cm']),('cat', Pipeline([('fill',SimpleImputer(strategy='most_frequent')),('onehot',OneHotEncoder(handle_unknown='ignore'))]),['position','sub_position'])])
model = Pipeline([('preprocess', pre), ('model', HistGradientBoostingRegressor(max_iter=180, learning_rate=.07, l2_regularization=1.0))])
model.fit(df[features], df.log_value)
OUT.write_text(json.dumps({'source_rows': len(df), 'features': features, 'target': 'log(market_value_in_eur)', 'note': 'Use this as an offline baseline; live form, contract and trend inputs are applied client-side.'}, indent=2))
print(f'Wrote {OUT} from {len(df):,} real player records.')
