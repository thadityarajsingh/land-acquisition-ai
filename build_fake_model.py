import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# Fake dataset — mimic the real features by name
np.random.seed(42)
n = 200
data = pd.DataFrame({
    "pending_approval": np.random.randint(0, 2, n),
    "incomplete_documents": np.random.randint(0, 5, n),
    "compensation_status": np.random.uniform(0, 1, n),
})
# Fake target: delay risk (1 = delayed, 0 = on time)
data["delay_risk"] = (
    (data["pending_approval"] == 1).astype(int) * 0.4 +
    (data["incomplete_documents"] > 2).astype(int) * 0.3 +
    (data["compensation_status"] < 0.3).astype(int) * 0.3
    > 0.4
).astype(int)
X = data.drop(columns=["delay_risk"])
y = data["delay_risk"]

fake_model = RandomForestClassifier(n_estimators=50, random_state=42)
fake_model.fit(X, y)

joblib.dump(fake_model, "fake_delay_model.pkl")
print("Fake model ready:", X.columns.tolist())