
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AppTheme, API_BASE_URL } from '../types';
import { Globe, User, Zap, ShieldCheck, CheckCircle2, X, Upload, FileText, Loader2, Copy, QrCode, Camera } from 'lucide-react';
import jsQR from 'jsqr';

export const Transfer: React.FC<{ theme: AppTheme }> = ({ theme }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState<'international' | 'domestic'>('international');
  const [speed, setSpeed] = useState<'instant' | 'fast' | 'standard'>('instant');
  const [showSettlement, setShowSettlement] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  const fees = { instant: 2.99, fast: 0.99, standard: 0.00 };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const handleSendClick = () => {
    if (!amount || !recipient) return;
    setShowSettlement(true);
  };

  const confirmTransfer = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('receipt', selectedFile);
      formData.append('amount', amount);
      formData.append('recipient', recipient);
      formData.append('currency', currency);
      formData.append('transferType', transferType);

      const response = await fetch(`${API_BASE_URL}/transfer/verify`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Verification failed');

      setIsUploading(false);
      setShowSettlement(false);
      setStep(2);
      setTimeout(() => {
          setStep(1);
          setAmount('');
          setRecipient('');
          setSelectedFile(null);
          setFilePreview(null);
      }, 4000);
    } catch (error) {
      console.error(error);
      alert('Proof submission failed. Please try again.');
      setIsUploading(false);
    }
  };

  // QR Scanner Logic
  const startScanner = async () => {
    setShowScanner(true);
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Could not access camera. Please check permissions.');
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsScanning(false);
    setShowScanner(false);
  };

  const scanFrame = () => {
    if (videoRef.current && canvasRef.current && isScanning) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          console.log('Found QR code', code.data);
          handleQRCodeData(code.data);
          stopScanner();
          return;
        }
      }
      requestRef.current = requestAnimationFrame(scanFrame);
    }
  };

  const handleQRCodeData = (data: string) => {
    try {
      // Expected formats: 
      // 1. JSON: {"to": "ID", "amount": "100", "currency": "USD"}
      // 2. String: USER_ID:AMOUNT
      // 3. URL: paynova://transfer?to=ID&amount=100
      
      if (data.startsWith('{')) {
        const parsed = JSON.parse(data);
        if (parsed.to || parsed.recipient) setRecipient(parsed.to || parsed.recipient);
        if (parsed.amount) setAmount(parsed.amount.toString());
        if (parsed.currency) setCurrency(parsed.currency);
      } else if (data.includes('://')) {
        const url = new URL(data.replace('paynova://', 'http://paynova/'));
        const to = url.searchParams.get('to');
        const amt = url.searchParams.get('amount');
        const curr = url.searchParams.get('currency');
        if (to) setRecipient(to);
        if (amt) setAmount(amt);
        if (curr) setCurrency(curr);
      } else if (data.includes(':')) {
        const [to, amt] = data.split(':');
        setRecipient(to);
        if (amt) setAmount(amt);
      } else {
        setRecipient(data);
      }
    } catch (e) {
      console.error('Error parsing QR data:', e);
      setRecipient(data); // Fallback to raw string
    }
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (step === 2) {
      return (
          <div className="h-full flex flex-col items-center justify-center py-20 animate-fadeIn text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Verification Sent</h2>
              <div className="max-w-md p-6 border rounded-2xl space-y-4 dark:bg-white/5 dark:border-green-500/30 bg-slate-50 border-slate-200">
                  <p className="text-gray-500">Your manual transfer is being verified via the PayNova backend network.</p>
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Expected Settlement: 60s</p>
              </div>
              <Button variant="secondary" className="mt-8" onClick={() => setStep(1)}>Return Home</Button>
          </div>
      )
  }

  const currentFee = fees[speed];
  const totalAmount = (parseFloat(amount) || 0) + currentFee;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn relative">
      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md space-y-6 relative">
             <button onClick={stopScanner} className="absolute -top-12 right-0 text-white/50 hover:text-white p-2">
                <X className="w-8 h-8" />
             </button>
             <div className="text-center space-y-2">
                <Camera className="w-10 h-10 mx-auto text-[#4facfe] animate-pulse" />
                <h3 className="text-2xl font-bold">Scanning Node QR</h3>
                <p className="text-sm text-gray-500">Align the code within the frame to verify recipient</p>
             </div>
             
             <div className="relative aspect-square overflow-hidden rounded-[2rem] border-2 border-[#4facfe]/30 bg-black">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanner Frame UI */}
                <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none"></div>
                <div className="absolute top-[40px] left-[40px] right-[40px] bottom-[40px] border-2 border-[#4facfe] rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(79,172,254,0.3)]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#9cff57]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#9cff57]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#9cff57]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#9cff57]"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#4facfe] animate-[scannerLine_2s_infinite]"></div>
                </div>
             </div>
             
             <style>{`
                @keyframes scannerLine {
                    0% { transform: translateY(-100px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100px); opacity: 0; }
                }
             `}</style>
             
             <Button fullWidth variant="secondary" onClick={stopScanner}>Cancel Scan</Button>
          </div>
        </div>
      )}

      {showSettlement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <Card className="w-full max-w-4xl relative max-h-[90vh] overflow-y-auto p-8">
            {!isUploading && <button onClick={() => setShowSettlement(false)} className="absolute top-4 right-4 text-gray-400 hover:text-current"><X className="w-5 h-5" /></button>}
            
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Manual Settlement Verification</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 rounded-xl border dark:bg-white/5 dark:border-white/10 bg-slate-100 border-slate-200 space-y-2">
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">MPESA (VODACOM)</p>
                        <p className="text-sm font-bold truncate">Cuthbert Gonzalva Rwebilumi</p>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold">+255741046593</span>
                            <button onClick={() => copyToClipboard('+255741046593')} className="p-1 hover:bg-blue-500/10 rounded"><Copy className="w-3 h-3" /></button>
                        </div>
                    </div>
                     <div className="p-4 rounded-xl border dark:bg-white/5 dark:border-white/10 bg-slate-100 border-slate-200 space-y-2">
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">NMB BANK</p>
                        <p className="text-sm font-bold truncate">Craig Furahini Mbwilo</p>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold">22510121264</span>
                            <button onClick={() => copyToClipboard('22510121264')} className="p-1 hover:bg-blue-500/10 rounded"><Copy className="w-3 h-3" /></button>
                        </div>
                    </div>
                     <div className="p-4 rounded-xl border dark:bg-white/5 dark:border-white/10 bg-slate-100 border-slate-200 space-y-2">
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">CRDB BANK</p>
                        <p className="text-sm font-bold truncate">Godson Martin Rubenga</p>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold">0152873704000</span>
                            <button onClick={() => copyToClipboard('0152873704000')} className="p-1 hover:bg-blue-500/10 rounded"><Copy className="w-3 h-3" /></button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto w-full">
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Value to Verify</span>
                        <span className="text-xl font-bold text-blue-500">{totalAmount.toFixed(2)} {currency}</span>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4 text-blue-500" /> Upload Verification Proof
                        </label>
                        {!filePreview ? (
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-700 rounded-xl p-8 cursor-pointer hover:border-[#4facfe] text-center">
                                <FileText className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                                <p className="text-xs text-gray-500 uppercase">Drop Bank Receipt Here</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-green-500/30">
                                <img src={filePreview} alt="Proof" className="w-full h-32 object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <button onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="absolute top-2 right-2 p-1 bg-black/80 rounded"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>
                </div>

                <Button fullWidth onClick={confirmTransfer} disabled={isUploading || !selectedFile} className="max-w-2xl mx-auto h-16">
                    {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit for Backend Verification'}
                </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold mb-1">Node Transfer</h2>
            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Secure Global Network</p>
        </div>
        <button onClick={startScanner} className="p-3 bg-[#4facfe]/10 border border-[#4facfe]/30 rounded-2xl text-[#4facfe] hover:bg-[#4facfe] hover:text-black transition-all flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Scan QR</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setTransferType('international')} className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${transferType === 'international' ? 'bg-blue-500/10 border-blue-500/40 shadow-xl' : 'bg-white/5 border-white/10'}`}>
          <Globe className={`w-8 h-8 ${transferType === 'international' ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="font-bold text-sm tracking-widest">INTERNATIONAL</span>
        </button>
        <button onClick={() => setTransferType('domestic')} className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${transferType === 'domestic' ? 'bg-blue-500/10 border-blue-500/40 shadow-xl' : 'bg-white/5 border-white/10'}`}>
          <User className={`w-8 h-8 ${transferType === 'domestic' ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="font-bold text-sm tracking-widest">DOMESTIC</span>
        </button>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recipient</label>
            <div className="relative group">
                <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Node ID or Wallet" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 pr-12 focus:border-[#4facfe] outline-none" />
                <button onClick={startScanner} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4facfe] transition-colors">
                    <QrCode className="w-5 h-5" />
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 focus:border-[#4facfe] outline-none" />
            </div>
             <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 focus:border-[#4facfe] outline-none appearance-none">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Processing Speed</label>
        <div onClick={() => setSpeed('instant')} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${speed === 'instant' ? 'bg-blue-500/5 border-blue-500' : 'bg-black/20 border-white/5'}`}>
          <div className="flex items-center gap-3">
            <Zap className={`w-5 h-5 ${speed === 'instant' ? 'text-blue-500' : 'text-gray-500'}`} />
            <div>
              <p className="font-bold text-sm">Instant Pulse</p>
              <p className="text-[10px] text-gray-500">Estimated: 60s</p>
            </div>
          </div>
          <span className="font-mono text-xs">${fees.instant.toFixed(2)}</span>
        </div>
      </div>

      <Button fullWidth className="h-16 text-lg" onClick={handleSendClick} disabled={!amount || !recipient}>
        Initiate Verification
      </Button>
    </div>
  );
};
