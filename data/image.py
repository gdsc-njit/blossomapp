import requests

url = "https://mymaps.usercontent.google.com/hostedimage/m/*/3AKcrxGQnTLLrRC25v-BKfL1AFA298p5L8KK8nNkc4kW4_42tOdKz_EXqeZG1H9HJzSu6dFcTe45lOJ9Mn-9qzG3h4Yzqv7n2AVov42U-n8WPCHO3QCF_ZMuEQlUQR4VNJOJLaZJWpp9U-6jlzlvQHE6ILBVQhhY0huQ5761KUOXoqH0nsnyBw0lmo7HJHS61mOGRsWt6LX0c9imnBwdxsD5vbyaFktjbHEM8d0WJbatG2jBEsGgNfCSKUvAmqI0?authuser=0&fife=s16383"
headers = {
    "User-Agent": "Mozilla/5.0"
}
r = requests.get(url, headers=headers)
with open("image.jpg", "wb") as f:
    f.write(r.content)
