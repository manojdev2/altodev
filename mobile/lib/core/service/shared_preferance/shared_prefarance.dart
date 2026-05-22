
import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../session/session.dart';

class SharedPrefs {
  static const _kAccess = 'access_token';
  static const _kUser = 'user';

  // Keep sensitive token encrypted at rest.
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: _kAccess, value: token);
    Session.setToken(token);
  }

  Future<String?> getToken() async {
    final t = await _secureStorage.read(key: _kAccess);
    Session.setToken(t);
    return t;
  }

  String? get tokenSync => Session.accessToken;

  Future<void> saveUser(Map<String, dynamic> user) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_kUser, jsonEncode(user));
  }

  Future<Map<String, dynamic>?> getUser() async {
    final p = await SharedPreferences.getInstance();
    final s = p.getString(_kUser);
    return s == null ? null : jsonDecode(s) as Map<String, dynamic>;
  }

  Future<void> clear() async {
    final p = await SharedPreferences.getInstance();
    await p.remove(_kUser);
    await _secureStorage.delete(key: _kAccess);
    Session.clear();
  }
}
