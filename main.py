import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler


def hydration_monitoring():
    """
    Calculates the hydration level as a percentage of total body water and provides an assessment.

    Returns:
    float: The user's hydration level as a percentage of total body water.
    str: The user's hydration status assessment.
    """
    # Get user input
    hr = float(input("Enter your heart rate (beats per minute): "))
    spo2 = float(input("Enter your blood oxygen saturation (percentage): "))
    rr = float(input("Enter your respiration rate (breaths per minute): "))
    t_a = float(input("Enter the ambient temperature (degrees Celsius): "))
    t_s = float(input("Enter your skin temperature (degrees Celsius): "))
    tbw = float(input("Enter your total body water percentage: "))
    age = int(input("Enter your age (years): "))
    height = float(input("Enter your height (centimeters): "))
    sex = input("Enter your sex (male or female): ")
    weight = float(input("Enter your weight (kilograms): "))

    # Compile the input features
    X = np.array([[hr, spo2, rr, t_a, t_s, age, height, weight]])

    # Encode the sex feature
    if sex.lower() == "male":
        X[:, 6] = 1
    else:
        X[:, 6] = 0

    # Standardize the input features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train the linear regression model
    model = LinearRegression()
    model.fit(X_scaled, [tbw])

    # Predict the hydration level
    hydration_level = model.predict(X_scaled)[0]

    # Ensure the hydration level is within the valid range (0-100%)
    hydration_level = max(0.0, min(100.0, hydration_level))

    # Determine the hydration status
    if hydration_level < 29:
        status = "Dehydrated"
    elif hydration_level < 59:
        status = "Mildly Dehydrated"
    else:
        status = "Hydrated"

    return hydration_level, status


# Call the hydration_monitoring function to get the user's hydration level and status
user_hydration_level, user_hydration_status = hydration_monitoring()
print(f"Your hydration level is {user_hydration_level:.2f}% of your total body water.")
print(f"Your hydration status is: {user_hydration_status}")
