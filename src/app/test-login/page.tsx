'use client';

import { useState } from 'react';

export default function TestLoginPage() {
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: {
          'set-cookie': res.headers.get('set-cookie'),
          'content-type': res.headers.get('content-type'),
        },
        data: data,
      });

      // Check if cookie was set
      const cookies = document.cookie;
      setResponse((prev: any) => ({
        ...prev,
        documentCookie: cookies,
      }));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkEnv = async () => {
    try {
      const res = await fetch('/api/test-env');
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie;
    setResponse({
      documentCookie: cookies,
      cookieCount: cookies.split(';').length,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">登录测试工具</h1>

        {/* 环境检查 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">环境检查</h2>
          <button
            onClick={checkEnv}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            检查环境变量
          </button>
        </div>

        {/* Cookie 检查 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cookie 检查</h2>
          <button
            onClick={checkCookies}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            检查浏览器 Cookie
          </button>
        </div>

        {/* 登录测试 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">登录测试</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试登录'}
            </button>
          </div>
        </div>

        {/* 响应结果 */}
        {response && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">响应结果</h2>
            <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-700">错误</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">使用说明</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>点击"检查环境变量"查看环境配置</li>
            <li>点击"检查浏览器 Cookie"查看当前 Cookie</li>
            <li>输入密码（默认：admin123）并点击"测试登录"</li>
            <li>查看响应结果，特别注意：
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>status 应该是 200</li>
                <li>data.success 应该是 true</li>
                <li>headers.set-cookie 应该包含 admin_session</li>
                <li>documentCookie 应该包含 admin_session</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="text-center">
          <a href="/admin/login" className="text-blue-600 hover:underline">
            返回登录页面
          </a>
        </div>
      </div>
    </div>
  );
}
