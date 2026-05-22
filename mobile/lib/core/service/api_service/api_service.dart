


import 'package:get/get.dart';

import '../../../feature/Auth/UI/screen/login_screen.dart';
import '../network/network_client.dart';
import '../session/session.dart';
import '../shared_preferance/shared_prefarance.dart';

/// Android emulator → 10.0.2.2 (host machine loopback)
/// Android real device → your PC's WiFi IP
/// iOS / desktop → localhost
String get _apiBaseUrl =>"https://uv-charging-backend-1.onrender.com";

class NetworkService {
  late final NetworkClient client;

  NetworkService() {
    client = NetworkClient(
      baseUrl: _apiBaseUrl,
      onUnAuthorize: _handleUnauthorized,
      commonHeaders: _buildHeaders,
    );
  }

  Map<String, String> _buildHeaders() {
    final h = <String, String>{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    final t = Session.accessToken;        // <- sync from cache
    if (t != null && t.isNotEmpty) {
      h['Authorization'] = 'Bearer $t';
    }
    return h;
  }

  void _handleUnauthorized() async {
    // Don't handle if no token was set (prevents startup race condition)
    if (Session.accessToken == null || Session.accessToken!.isEmpty) {
      return;
    }

    // Clear local storage and session
    final sharedPrefs = SharedPrefs();
    await sharedPrefs.clear();
    Session.accessToken = null;

    // Navigate to login screen
    Get.offAll(() => const LoginScreen());

    Get.snackbar(
      'Session Expired',
      'Please login again',
      snackPosition: SnackPosition.BOTTOM,
    );
  }
}