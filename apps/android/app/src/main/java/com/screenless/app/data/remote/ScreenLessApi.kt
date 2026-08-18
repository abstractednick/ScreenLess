package com.screenless.app.data.remote

import com.screenless.app.BuildConfig
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import javax.inject.Singleton

interface ScreenLessApi {
    @POST("auth/login")
    suspend fun login(@Body body: Map<String, String>): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body body: Map<String, String>): AuthResponse

    @GET("windows")
    suspend fun windows(@Header("Authorization") bearer: String): WindowsResponse

    @GET("groups")
    suspend fun groups(@Header("Authorization") bearer: String): GroupsResponse

    @GET("streaks")
    suspend fun streaks(@Header("Authorization") bearer: String): StreaksResponse

    @POST("signals")
    suspend fun sendSignal(
        @Header("Authorization") bearer: String,
        @Body body: Map<String, String>,
    )
}

data class AuthResponse(val token: String, val user: ApiUser)
data class ApiUser(val id: String, val displayName: String, val avatarHue: Int, val email: String?)
data class WindowsResponse(val windows: List<Map<String, Any?>>)
data class GroupsResponse(val groups: List<Map<String, Any?>>)
data class StreaksResponse(val streaks: List<Map<String, Any?>>)

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun api(): ScreenLessApi {
        val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
        val client = OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
            .build()
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(ScreenLessApi::class.java)
    }
}
