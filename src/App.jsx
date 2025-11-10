import { useState, useRef, useEffect } from 'react'
import { InputArea } from './components/chat/input-area/InputArea'
import { BubbleArea } from './components/chat/bubble-area/BubbleArea'
import OptionGrid from './components/options/OptionGrid'
import FinalProductCard from './components/final-product/FinalProductCard'
import newMessageHandler from './core/handlers/newMessageHandler'
import { calculateNextUiState } from './core/engine/deterministFilterNode'
import aiPrompter from './core/ai/aiPrompter'
import buildMessage from './helpers/buildMessage'
import { mapFacetValueToLabel } from './core/engine/facetsNode'
import debugLog from './helpers/debugLog'
import initialMessages from './data/messages.json'

function App() {
  const [activeCell, setActiveCell] = useState('cell1')
  const [messages, setMessages] = useState(initialMessages || [])
  const [selectedFacets, setSelectedFacets] = useState({})
  const [configuratorQuestion, setConfiguratorQuestion] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [uiState, setUiState] = useState(null)
  const bubbleAreaRef = useRef(null)

  // Initialize first question on load
  useEffect(() => {
    const nextUiState = calculateNextUiState(selectedFacets, {
      saveFilteredProducts: setFilteredProducts
    })
    setUiState(nextUiState)
    if (nextUiState.nextFacet) {
      setConfiguratorQuestion(nextUiState.filterState.questionText)
    }
  }, []) // Empty dependency array = run once on mount

  const showCell = (cellId) => {
    setActiveCell(cellId)
  }

  function appendMessage(msg) {
    setMessages((s) => [...s, msg])
  }

  function handleSend(text) {
    // Call newMessageHandler with text, appendMessage callback, selectedFacets, setConfiguratorQuestion, and saveFilteredProducts
    newMessageHandler(text, appendMessage, selectedFacets, setConfiguratorQuestion, setFilteredProducts)
  }

  async function handleOptionSelect(value) {
    if (!uiState || !uiState.nextFacet) return;

    debugLog('[UI] onSelect', { facet: uiState.nextFacet, value });

    // Update selectedFacets with the chosen value
    const updatedFacets = { ...selectedFacets, [uiState.nextFacet]: value };
    setSelectedFacets(updatedFacets);

    // Restart engine flow with updated facets
    const nextUiState = calculateNextUiState(updatedFacets, {
      saveFilteredProducts: setFilteredProducts
    });
    setUiState(nextUiState);

    // --- Chat sync logic ---
    // 1. Append human message for the selected option
    const label = mapFacetValueToLabel(uiState.nextFacet, value);
    appendMessage(buildMessage('human', label));

    // 2. Get the next question or result from aiPrompter and append as bot message
    const aiReply = await aiPrompter(label, updatedFacets, setConfiguratorQuestion, setFilteredProducts);
    appendMessage(buildMessage('bot', aiReply));
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bubbleAreaRef.current) {
      bubbleAreaRef.current.scrollTop = bubbleAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-screen w-screen m-0 p-0 flex flex-col overflow-hidden">
      {/* Header: Fixed 65px height */}
      <section id="header" className="h-[65px] w-full bg-[#36C0F2] flex items-center flex-shrink-0 px-6">
        <div className="h-12 w-12 rounded-full bg-[#0d1a26] flex items-center justify-center">
          <img src="/images/products/favicon-fabricadoaluminio.png" alt="Logo" className="h-8 w-8" />
        </div>
      </section>

      {/* Content: Takes remaining height (calc(100vh - 65px)) */}
      <div id="content" className="h-[calc(100vh-65px)] w-full flex flex-row">
        {/* Configurator: Takes full height of content, can scroll independently */}
        <div 
          id="configurator"
          className={`h-full flex-1 ${activeCell === 'cell1' ? 'flex' : 'hidden'} md:flex flex-col items-center justify-start bg-[#0d1a26] text-white overflow-y-auto`}
        >
          <div id="configuratorQuestion" className="w-full p-6 text-center text-2xl font-semibold">
            {uiState && uiState.canFinalize && uiState.finalProduct
              ? 'Aqui está seu produto!'
              : configuratorQuestion || 'Aguardando pergunta...'}
          </div>
          
          {/* Render OptionGrid when we have options to display */}
          {uiState && uiState.nextFacet && uiState.filterState.currentOptions.length > 0 && (
            <div className="w-full max-w-4xl px-6 pb-6">
              <OptionGrid
                facetKey={uiState.nextFacet}
                questionText="" 
                options={uiState.filterState.currentOptions}
                onSelect={handleOptionSelect}
              />
            </div>
          )}
          
          {/* Show final product if canFinalize */}
          {uiState && uiState.canFinalize && uiState.finalProduct && (
            <div className="w-full max-w-3xl px-6 pb-6">
              <FinalProductCard product={uiState.finalProduct} />
            </div>
          )}
        </div>

        {/* Chat: Takes full height of content, flex-col for stacking, overflow-hidden is CRITICAL */}
        <div
          id="chat"
          className={`h-full flex-1 ${activeCell === 'cell2' ? 'flex' : 'hidden'} md:flex flex-col md:max-w-[500px] overflow-hidden`} style={{ background: 'linear-gradient(90deg, #08111a 0%, #0d1a26 100%)' }}
        >
          {/* Bubble Area: flex-1 takes all available space, overflow-y-auto makes ONLY this scroll */}
          <div ref={bubbleAreaRef} className="flex-1 overflow-y-auto">
            <BubbleArea messages={messages} />
          </div>

          {/* Input Area: flex-shrink-0 prevents shrinking, stays fixed at bottom */}
          <div className="flex-shrink-0">
            <InputArea onSend={handleSend} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-700 z-50 md:hidden flex shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
        <button 
          className={`flex-1 p-4 text-white text-base transition-colors hover:bg-gray-800 ${activeCell === 'cell1' ? 'bg-blue-500' : ''}`}
          onClick={() => showCell('cell1')}
        >
          Wizard
        </button>
        <button 
          className={`flex-1 p-4 text-white text-base transition-colors hover:bg-gray-800 ${activeCell === 'cell2' ? 'bg-blue-500' : ''}`}
          onClick={() => showCell('cell2')}
        >
          Chat
        </button>
      </div>
    </div>
  )
}

export default App
