"""
author: GSORF (Adam)
license: MIT
date: 02.04.2022, 15:40
version: 1.0
"""



import base64 # used to decode image data
import json # used to read dataset files
import numpy as np # used to store data in arrays
import matplotlib.pyplot as plt # used to create plots
#import cv2 # (can be) used for displaying images

"""
GLOBAL Settings - please adjust to your own dataset
"""

# DATASET_FILENAME = "measurement_1649076149745.txt"
# DATASET_FILENAME = "measurement_1649077802860.txt"
# DATASET_FILENAME = "measurement_1649078670347.txt"
# DATASET_FILENAME = "measurement_1649078670347_after_waiting.txt"
DATASET_FILENAME = "measurement_1649081103265.txt"
DATASET_SOURCE_VIDEO = "camera"
DATASET_SOURCE_ACCELEROMETER = "accelerometer"
DATASET_SOURCE_GYROSCOPE = "gyroscope"
DATASET_SOURCE_MAGNETOMETER = "magnetometer"
DATASET_SOURCE_GPS = "gps"

"""
Parsing code
"""

data = None
# Open and read whole dataset
with open(DATASET_FILENAME, 'r') as f:
  data = json.load(f)

# Check what data has been recorded, i.e. "dict_keys(['video', 'accelerometer', 'gyroscope', 'magnetometer', 'gps'])"
data_sources = list(data.keys())

has_video = False
has_accelerometer = False
has_gyroscope = False
has_magnetometer = False
has_gps = False

for source in data_sources:
    if source == DATASET_SOURCE_VIDEO:
        has_video = True
    if source == DATASET_SOURCE_ACCELEROMETER:
        has_accelerometer = True
    if source == DATASET_SOURCE_GYROSCOPE:
        has_gyroscope = True
    if source == DATASET_SOURCE_MAGNETOMETER:
        has_magnetometer = True
    if source == DATASET_SOURCE_GPS:
        has_gps = True


print("The dataset contains", [source for source in data_sources] )

# Get individual sensor measurements (i.e. video frames, gps, accelerometer, gyroscope, magnetometer)
video_data = []
accelerometer_data = []
gyroscope_data = []
magnetometer_data = []
gps_data = []

## video frames
if has_video:
    video_data = data[DATASET_SOURCE_VIDEO]
    
## accelerometer
if has_accelerometer:
    accelerometer_data = data[DATASET_SOURCE_ACCELEROMETER]
    
## gyroscope
if has_gyroscope:
    gyroscope_data = data[DATASET_SOURCE_GYROSCOPE]
    
## magnetometer
if has_magnetometer:
    magnetometer_data = data[DATASET_SOURCE_MAGNETOMETER]

## gps
if has_gps:
    gps_data = data[DATASET_SOURCE_GPS]

"""
Visualization of data
"""

"""
"""
for video_frame in video_data:
    timestamp = video_frame["time_ms"]
    imgdata = video_frame["image"]
    print("image timestamp: ", timestamp, "ms")
    filename = str(timestamp) + ".png"
    imgdata = imgdata.replace("data:image/png;base64,","") # This additional header part is not needed in the base64 decoding step below
    imgdata = base64.urlsafe_b64decode(imgdata)
    with open(filename, 'wb') as f:
        f.write(imgdata)

if has_accelerometer:
    acc_x = []
    acc_y = []
    acc_z = []
    acc_times = []
    for accelerometer_frame in accelerometer_data:
        timestamp = float(accelerometer_frame["time_ms"])
        x = float(accelerometer_frame["x"])
        y = float(accelerometer_frame["y"])
        z = float(accelerometer_frame["z"])
        acc_times.append(timestamp)
        acc_x.append(x)
        acc_y.append(y)
        acc_z.append(z)
        
        print(timestamp,"ms:",x,"m/s^2",y,"m/s^2",z,"m/s^2")



    fig, (ax1, ax2, ax3) = plt.subplots(3, 1)
    # make a little extra space between the subplots
    fig.subplots_adjust(hspace=0.5)
    fig.suptitle('Accelerometer data', fontsize=16)

    ax1.plot(acc_times, acc_x)
    ax1.set_xlabel('timestamp (ms)')
    ax1.set_ylabel('x (m/s^2)')
    ax1.grid(True)

    ax2.plot(acc_times, acc_y)
    ax2.set_xlabel('timestamp (ms)')
    ax2.set_ylabel('y (m/s^2)')
    ax2.grid(True)

    ax3.plot(acc_times, acc_z)
    ax3.set_xlabel('timestamp (ms)')
    ax3.set_ylabel('z (m/s^2)')
    ax3.grid(True)




if has_gyroscope:
    gyro_x = []
    gyro_y = []
    gyro_z = []
    gyro_times = []
    for gyroscope_frame in gyroscope_data:
        print(gyroscope_frame)
        timestamp = float(gyroscope_frame["time_ms"])
        x = float(gyroscope_frame["x"])
        y = float(gyroscope_frame["y"])
        z = float(gyroscope_frame["z"])
        gyro_times.append(timestamp)
        gyro_x.append(x)
        gyro_y.append(y)
        gyro_z.append(z)
        
        
        print(timestamp,"ms:",x,"m/s^2",y,"m/s^2",z,"m/s^2")



    fig, (ax1, ax2, ax3) = plt.subplots(3, 1)
    # make a little extra space between the subplots
    fig.subplots_adjust(hspace=0.5)
    fig.suptitle('Gyroscope data', fontsize=16)

    ax1.plot(gyro_times, gyro_x)
    ax1.set_xlabel('timestamp (ms)')
    ax1.set_ylabel('x (rad/s)')
    ax1.grid(True)

    ax2.plot(gyro_times, gyro_y)
    ax2.set_xlabel('timestamp (ms)')
    ax2.set_ylabel('y (rad/s)')
    ax2.grid(True)

    ax3.plot(gyro_times, gyro_z)
    ax3.set_xlabel('timestamp (ms)')
    ax3.set_ylabel('z (rad/s)')
    ax3.grid(True)


if has_magnetometer:
    mag_x = []
    mag_y = []
    mag_z = []
    mag_times = []
    for magnetometer_frame in magnetometer_data:
        print(magnetometer_frame)
        timestamp = float(magnetometer_frame["time_ms"])
        x = float(magnetometer_frame["x"])
        y = float(magnetometer_frame["y"])
        z = float(magnetometer_frame["z"])
        mag_times.append(timestamp)
        mag_x.append(x)
        mag_y.append(y)
        mag_z.append(z)
        
        
        print(timestamp,"ms:",x,"muT",y,"muT",z,"muT")



    fig, (ax1, ax2, ax3) = plt.subplots(3, 1)
    # make a little extra space between the subplots
    fig.subplots_adjust(hspace=0.5)
    fig.suptitle('Magnetometer data', fontsize=16)

    ax1.plot(mag_times, mag_x)
    ax1.set_xlabel('timestamp (ms)')
    ax1.set_ylabel('x (muT)')
    ax1.grid(True)

    ax2.plot(mag_times, mag_y)
    ax2.set_xlabel('timestamp (ms)')
    ax2.set_ylabel('y (muT)')
    ax2.grid(True)

    ax3.plot(mag_times, mag_z)
    ax3.set_xlabel('timestamp (ms)')
    ax3.set_ylabel('z (muT)')
    ax3.grid(True)


if has_gps:
    gps_lat = []
    gps_lon = []
    gps_accuracy = []
    gps_alt = []
    gps_alt_accuracy = []
    gps_heading = []
    gps_speed = []
    gps_easting = []
    gps_easting_offset = []
    gps_northing = []
    gps_northing_offset = []
    gps_zone = []
    gps_times = []
    gps_raw_time = []
    for gps_frame in gps_data:
        timestamp = float(gps_frame["time_ms"])
        raw_timestamp = float(gps_frame["timestamp"])
        lat = float(gps_frame["latitude"])
        lon = float(gps_frame["longitude"])
        accuracy = float(gps_frame["accuracy"])
        alt = float(gps_frame["altitude"])
        alt_accuracy = float(gps_frame["altitudeAccuracy"] if (gps_frame["altitudeAccuracy"] is not None) else 0)
        heading = float(gps_frame["heading"])
        speed = float(gps_frame["speed"])
    
        easting = float(gps_frame["easting"])
        easting_offset = float(gps_frame["easting_offset"])
        northing = float(gps_frame["northing"])
        northing_offset = float(gps_frame["northing_offset"])
        zone = float(gps_frame["zoneNum"])
        
        gps_lat.append(lat)
        gps_lon.append(lon)
        gps_accuracy.append(accuracy)
        gps_alt.append(alt)
        gps_alt_accuracy.append(alt_accuracy)
        gps_heading.append(heading)
        gps_speed.append(speed)
        gps_easting.append(easting)
        gps_easting_offset.append(easting_offset)
        gps_northing.append(northing)
        gps_northing_offset.append(northing_offset)
        gps_zone.append(zone)
        gps_times.append(timestamp)
        gps_raw_time.append(raw_timestamp)
    
        print(gps_frame)

    fig, (ax1, ax2, ax3, ax4, ax5) = plt.subplots(5, 1)
    # make a little extra space between the subplots
    fig.subplots_adjust(hspace=0.5)
    fig.suptitle('GPS data', fontsize=16)

    ax1.plot(gps_times, gps_lat)
    ax1.set_xlabel('timestamp (ms)')
    ax1.set_ylabel('latitude (deg)')
    ax1.grid(True)

    ax2.plot(gps_times, gps_lon)
    ax2.set_xlabel('timestamp (ms)')
    ax2.set_ylabel('longitude (deg)')
    ax2.grid(True)

    ax3.plot(gps_times, gps_accuracy)
    ax3.set_xlabel('timestamp (ms)')
    ax3.set_ylabel('accuracy (m)')
    ax3.grid(True)

    ax4.plot(gps_times, gps_heading)
    ax4.set_xlabel('timestamp (ms)')
    ax4.set_ylabel('heading (deg)')
    ax4.grid(True)

    ax5.plot(gps_times, gps_speed)
    ax5.set_xlabel('timestamp (ms)')
    ax5.set_ylabel('speed (m/s)')
    ax5.grid(True)


plt.show()

"""
"""





"""

exit()


"""

