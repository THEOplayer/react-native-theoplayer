# Do no warn if any of the API classes we resolve with compileOnly are missing because the feature
# is disabled: it is expected.
-dontwarn com.theoplayer.android.api.**
-dontwarn com.google.android.gms.cast.**

# We rely on gson to instantiate some source classes from json, so make sure they are not obfuscated.
-keep,includedescriptorclasses class com.theoplayer.android.api.source.** { *; }
